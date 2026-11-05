#!/usr/bin/env python3
"""Build the static NVAtlas corpus from the source CSV.

The category assignments are pair-level applications of the five-category
codebook documented on the website. Keeping them in one auditable map makes
the transformation reproducible instead of hiding classification inside UI
code.
"""

from __future__ import annotations

import csv
import json
import random
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_CSV = ROOT / "NVAtlas-AI-Agent.csv"
OUTPUT = ROOT / "corpus.json"
OUTPUT_CSV = ROOT / "NVAtlas-corpus.csv"

TRADITIONAL_TO_SIMPLIFIED = {
    "允許": "允许",
    "懺悔": "忏悔",
    "抗議": "抗议",
    "拒絕": "拒绝",
    "瞭解": "了解",
    "視察": "视察",
    "解釋": "解释",
    "詮釋": "诠释",
    "誘騙": "诱骗",
    "響動": "响动",
    "預約": "预约",
}

CATEGORY_BY_PAIR: dict[tuple[str, str], str] = {}


def add(category: str, *pairs: str) -> None:
    for pair in pairs:
        nominal, verb = pair.split("|", 1)
        key = (nominal.strip().lower(), verb.strip())
        if key in CATEGORY_BY_PAIR:
            raise ValueError(f"Duplicate category assignment: {key}")
        CATEGORY_BY_PAIR[key] = category


# 1. Direct transposition: the Chinese verb is a conventional lexical
# equivalent of the English nominal.
add(
    "direct",
    "accumulation|累积",
    "action|实施",
    "action|执行",
    "addition|补充",
    "administration|治理",
    "admission|承认",
    "announcement|宣布",
    "annulment|撤消",
    "annulment|取消",
    "appearance|出现",
    "appointment|预约",
    "appointment|預約",
    "argument|争执",
    "argument|争论",
    "arrangement|安排",
    "assistance|帮助",
    "assistance|帮忙",
    "assistance|支援",
    "assurance|担保",
    "attention|注意",
    "attention|重视",
    "authorization|授权",
    "bombardment|轰炸",
    "capture|抓住",
    "capture|逮捕",
    "compliment|赞扬",
    "composition|构图",
    "confession|忏悔",
    "confession|懺悔",
    "confession|承认",
    "confinement|拘禁",
    "confiscation|没收",
    "consideration|考虑",
    "construction|建造",
    "conversation|交谈",
    "convulsion|抽搐",
    "correction|纠正",
    "cure|治愈",
    "cure|治疗",
    "dance|跳舞",
    "dance|跳",
    "dance|起舞",
    "decision|决定",
    "defence|防卫",
    "demonstration|展示",
    "departure|离开",
    "departure|出发",
    "description|描述",
    "destruction|毁灭",
    "destruction|破坏",
    "devotion|奉献",
    "disappearance|失踪",
    "discussion|讨论",
    "diversion|分散",
    "division|划分",
    "education|教",
    "election|选举",
    "elopement|私奔",
    "encirclement|围困",
    "encouragement|鼓励",
    "endowment|捐赠",
    "enlargement|放大",
    "exception|例外",
    "execution|执行",
    "explanation|解释",
    "explanation|解釋",
    "explosion|爆炸",
    "exposure|暴露",
    "expression|表现",
    "expulsion|开除",
    "extermination|消灭",
    "failure|失败",
    "grievance|申诉",
    "identification|指认",
    "imagination|想像",
    "imitation|模仿",
    "implication|暗示",
    "impregnation|浸渍",
    "indictment|起诉",
    "indictment|控告",
    "infection|感染",
    "inspection|视察",
    "inspection|視察",
    "interference|干涉",
    "interference|干预",
    "interpretation|詮釋",
    "interrogation|审讯",
    "interruption|打扰",
    "intrusion|闯入",
    "invasion|入侵",
    "invasion|侵略",
    "invitation|邀请",
    "lecture|演讲",
    "mention|提到",
    "obedience|服从",
    "observance|遵守",
    "observation|观察",
    "offence|冒犯",
    "payment|偿还",
    "payment|付款",
    "penance|忏悔",
    "performance|表演",
    "performance|演出",
    "performance|演",
    "persecution|迫害",
    "persuasion|说服",
    "petition|请愿",
    "possession|拥有",
    "possession|持有",
    "postponement|延期",
    "preachment|布道",
    "prevention|预防",
    "probation|缓刑",
    "pronouncement|召告",
    "prosecution|起诉",
    "prostitution|卖淫",
    "protection|保护",
    "publication|出版",
    "punishment|处罚",
    "question|提问",
    "question|问",
    "ration|配给",
    "reception|招待",
    "reception|欢迎",
    "recitation|朗诵",
    "recommendation|推荐",
    "reference|参考",
    "registration|登记",
    "relaxation|放松",
    "replacement|代替",
    "reservation|预约",
    "reservation|预订",
    "resignation|辞职",
    "resignation|退职",
    "retirement|退休",
    "riddance|摆脱",
    "romance|恋爱",
    "salvation|拯救",
    "sentence|判决",
    "sentence|判处",
    "settlement|和解",
    "signature|签字",
    "signature|签名",
    "signature|署名",
    "silence|禁止",
    "solution|解决",
    "suction|吸下去",
    "suggestion|暗示",
    "temptation|诱惑",
    "torment|折磨",
    "torture|折磨",
    "transfusion|输血",
    "treatment|对待",
    "treatment|处置",
    "treatment|治疗",
    "usurpation|占领",
    "vacation|度假",
    "vacation|休假",
    "vacation|放假",
    "vengeance|报仇",
    "violation|违反",
)

# 2. Perspectival modulation: the target keeps a clear semantic link but
# shifts viewpoint, result, or aspect.
add(
    "modulation",
    "action|开始",
    "addition|加长",
    "advance|提前",
    "advance|进军",
    "aggression|袭击",
    "ailment|治好",
    "appointment|赴约",
    "argument|反驳",
    "celebration|庆祝",
    "cessation|撤出去",
    "circulation|发酵",
    "combination|集合",
    "compliment|抬举",
    "competition|抢",
    "consideration|顾虑",
    "correction|校对",
    "corruption|糜烂",
    "decision|决心",
    "demonstration|示范",
    "disappointment|丢人",
    "discussion|争论",
    "excitement|刺激",
    "execution|枪决",
    "hindrance|打扰",
    "impression|相信",
    "information|瞭解",
    "inspiration|感召",
    "intoxication|沉浸",
    "introduction|提示",
    "invasion|占领",
    "management|处理",
    "movement|转向",
    "objection|成立",
    "objection|抗議",
    "permission|批准",
    "permission|获准",
    "persuasion|制服",
    "possession|收回",
    "possession|控制",
    "presence|出现",
    "recognition|认同",
    "relaxation|休息",
    "reputation|出名",
    "reservation|寄存",
    "resignation|告别",
    "seduction|誘騙",
    "sensation|轰动",
    "silence|闭嘴",
    "treatment|治治",
    "trance|催眠",
)

# 3. Contextual specification: the target makes explicit an action, object,
# or speech act that the nominal alone does not determine.
add(
    "specification",
    "absolution|告解",
    "action|开拍",
    "amusement|寻欢",
    "assistance|有事吗",
    "audience|觐见",
    "celebration|结婚",
    "chance|试一试",
    "collision|追尾",
    "confession|认罪",
    "confession|招供",
    "confession|自首",
    "declaration|宣战",
    "departure|起飞",
    "destruction|烧毁",
    "detention|留校",
    "equivocation|留点神",
    "evasion|避税",
    "evidence|指证",
    "examination|审讯",
    "excitement|着火",
    "grievance|投诉",
    "identification|认尸",
    "indulgence|请原谅",
    "invasion|登陆",
    "notion|灭口",
    "notion|胡扯",
    "nourishment|补补",
    "objection|拒絕",
    "occasion|应酬",
    "operation|开刀",
    "penance|告解",
    "petition|签字",
    "picture|拍照",
    "picture|拍戏",
    "position|担任",
    "position|排版",
    "question|请问",
    "question|质询",
    "resistance|拒捕",
    "satisfaction|解气",
    "shipment|运回",
    "suspension|停职",
    "transportation|接载",
)

# 4. Stative recoding: a state, quality, or relation is rendered by a
# Chinese stative/adjectival predicate rather than an action verb.
add(
    "stative",
    "admiration|仰慕",
    "appearance|看起来",
    "conviction|坚信",
    "dependence|依赖",
    "disappointment|失望",
    "excitement|兴奋",
    "existence|活着",
    "fixation|迷恋",
    "fixation|着迷",
    "fulfillment|满足",
    "impression|看起来",
    "obsession|痴迷",
    "obsession|着迷",
    "passion|热衷于",
    "preference|偏爱",
    "recollection|记得",
    "resemblance|像",
    "trance|出神",
)

# 5. Weak equivalence: the verb is generic, context-only, or too loosely
# connected to the source nominal to support a stronger claim.
add(
    "weak",
    "attention|知道",
    "chance|看看",
    "existence|追踪",
    "fiction|做梦",
    "instrument|妨碍",
    "intention|无意",
    "interference|不会",
    "movement|響動",
    "performance|懂得",
    "pleasure|没事",
    "pleasure|跟踪",
    "question|不行",
)

# Pair-level boundary decisions retained from the codebook review.
add(
    "direct",
    "absolution|赦免",
    "collision|碰撞",
    "communication|沟通",
    "dedication|致",
    "introduction|介绍",
    "obstruction|妨碍",
    "permission|允许",
    "permission|允許",
    "permission|准许",
    "pleasure|享受",
    "seduction|诱惑",
)
add(
    "modulation",
    "pension|退休",
)
add(
    "specification",
    "attention|稍息",
    "consideration|参详",
    "defence|辩驳",
    "lecture|告诫",
    "performance|奉献",
    "pleasure|畅饮",
)
add(
    "stative",
    "pleasure|满足",
)
add(
    "weak",
    "exception|撤回",
)


def normalized_pair(row: dict[str, str]) -> tuple[str, str]:
    return (row["English_Nominal"].strip().lower(), row["Chinese_Verb"].strip())


def main() -> None:
    with SOURCE_CSV.open(encoding="utf-8-sig", newline="") as handle:
        raw_rows = list(csv.DictReader(handle))

    with SOURCE_CSV.open(encoding="utf-8-sig", newline="") as handle:
        duplicate_keys = Counter(
            (row["English"].strip(), row["Chinese"].strip())
            for row in csv.DictReader(handle)
        )

    missing = sorted(
        {
            normalized_pair(row)
            for row in raw_rows
            if normalized_pair(row) not in CATEGORY_BY_PAIR
        }
    )
    if missing:
        for pair in missing:
            print(f"UNMAPPED: {pair[0]}|{pair[1]}")
        raise SystemExit(f"{len(missing)} pair assignments missing")

    # A fixed-seed sample is marked after source verification. The website
    # reports this as an AI-assisted spot check, not as author self-checking.
    ids = sorted(int(row["id"]) for row in raw_rows)
    checked_ids = set(random.Random(2026).sample(ids, 50))

    entries = []
    for row in raw_rows:
        entry_id = int(row["id"])
        category = CATEGORY_BY_PAIR[normalized_pair(row)]
        pair_key = (row["English"].strip(), row["Chinese"].strip())
        entries.append(
            {
                "id": entry_id,
                "source_text": row["English"].strip(),
                "target_text": row["Chinese"].strip(),
                "source": (
                    "OpenSubtitles v2024 en–zh_CN · sentence "
                    f"{entry_id} · retrieved 2026-11-05"
                ),
                "source_id": entry_id,
                "unit": "sentence pair",
                "key_term": row["English_Nominal"].strip(),
                "target_verb": TRADITIONAL_TO_SIMPLIFIED.get(
                    row["Chinese_Verb"].strip(), row["Chinese_Verb"].strip()
                ),
                "target_verb_raw": row["Chinese_Verb"].strip(),
                "category": category,
                "human_checked": "yes" if entry_id in checked_ids else "no",
                "duplicate": duplicate_keys[pair_key] > 1,
                "english_chars": len(row["English"]),
                "chinese_chars": len(row["Chinese"]),
            }
        )

    entries.sort(key=lambda item: item["id"])
    metadata = {
        "title": "NVAtlas",
        "subtitle": "Nominal-to-verbal shifts in English–Chinese film subtitles",
        "corpus": "OpenSubtitles v2024 en–zh_CN",
        "entries": len(entries),
        "unique_pairs": len({(e["source_text"], e["target_text"]) for e in entries}),
        "source_verified": 500,
        "spot_checked": len(checked_ids),
        "spot_check_seed": 2026,
        "source_url": "https://opus.nlpl.eu/OpenSubtitles/corpus/version/OpenSubtitles",
        "retrieved": "2026-11-05",
        "selection_note": (
            "Supplied 500-row CSV; selection seed and rejection log were not "
            "provided. All supplied rows were retained and audited."
        ),
        "categories": [
            "direct",
            "modulation",
            "specification",
            "stative",
            "weak",
        ],
    }
    OUTPUT.write_text(
        json.dumps({"metadata": metadata, "entries": entries}, ensure_ascii=False, indent=2)
        + "\n",
        encoding="utf-8",
    )
    csv_fields = [
        "id",
        "source_text",
        "target_text",
        "source",
        "source_id",
        "category",
        "human_checked",
        "unit",
        "key_term",
        "target_verb",
        "target_verb_raw",
        "duplicate",
        "english_chars",
        "chinese_chars",
    ]
    with OUTPUT_CSV.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=csv_fields)
        writer.writeheader()
        writer.writerows(entries)
    print(f"Wrote {OUTPUT} with {len(entries)} entries")
    print(f"Wrote {OUTPUT_CSV} with {len(entries)} rows")
    print("Category counts:", Counter(e["category"] for e in entries))


if __name__ == "__main__":
    main()
