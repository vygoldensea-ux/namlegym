#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MÁY SOÁT LỆCH FACTS FOXFIT (0 đồng — chỉ so chữ, không gọi AI)
Cách dùng:  python3 tools/foxfit_facts_check.py <file1.json> [file2.json ...]
  - File workflow (get_workflow_details/get_workflow_version): quét jsCode các node theo dõi.
  - File execution chứa kho cache (dict có question_norm + answers): quét từng câu trả lời.
Nguồn chuẩn: khối FACTS bên dưới — PHẢI sửa khối này trước khi đổi giá/quà ở bất kỳ đâu.
Thoát mã 1 nếu có lệch.
"""
import json, re, sys, unicodedata

# ================== NGUỒN CHUẨN (đồng bộ với foxfit-facts.md) ==================
PRICES = {  # giá khai trương -> gói (tháng)
    '540k': 1, '1.233k': 3, '1.760k': 6, '3.040k': 12,
    '5.500k': 18, '6.500k': 24, '9.500k': 36,
}
BASE_PRICES = {'600k': 1, '1.450k': 3, '2.200k': 6, '3.800k': 12}  # giá gốc
OTHER_MONEY = {'500k', '50k', '350k'}  # PT lẻ / sauna-ngâm đá lẻ / tủ riêng
MONEY_WHITELIST = set(PRICES) | set(BASE_PRICES) | OTHER_MONEY

# token quà ĐẶC TRƯNG của từng gói (đã bỏ dấu) — xuất hiện cạnh sai gói là lệch
GIFT_TOKENS = {
    1: ['2 buoi pt 1:1'],
    3: ['1 buoi pt 1:1'],
    6: ['1 buoi tap mien phi'],
    12: ['2 thang tap mien phi'],
    18: ['3 thang tap mien phi'],
    24: ['4 thang tap mien phi'],
    36: ['6 thang tap mien phi'],
}
# facts SAI/CŨ tuyệt đối không được xuất hiện như lời khẳng định
FORBIDDEN = ['tang 3 buoi hlv', 'giam 15-20', 'tang 3 buoi tap cung hlv', '15-20%']
# ngữ cảnh cho phép nhắc tới facts cũ (dòng luật cấm / code detector)
FORBID_OK_CTX = ['khong co chuyen', 'thong tin cu', 'sai', 'cam ', 'claims3', "indexof('tang 3 buoi')", 'khong duoc']

# node phải chứa ĐỦ bộ facts lõi
REQUIRED_FULL_NODES = ['Chuan bi Claude', 'Build Ping AI']
REQUIRED_TOKENS = (
    list(PRICES) + list(BASE_PRICES)
    + ['058 675 7779', '43 le phung hieu', '24/07', '03/08', '500k/buoi', '50k/buoi']
    + [t for toks in GIFT_TOKENS.values() for t in toks]
)
# dang viet gop hop le cho cung 1 fact (co 1 trong cac dang la dat)
REQUIRED_ALTS = {
    '3 thang tap mien phi': ['tang 3/4/6 thang'],
    '4 thang tap mien phi': ['tang 3/4/6 thang'],
    '6 thang tap mien phi': ['tang 3/4/6 thang'],
}
# node chỉ cần quét chéo (không bắt đủ bộ)
WATCH_NODES = REQUIRED_FULL_NODES + [
    'Build Cmt AI', 'Chuan hoa Reply', 'Chuan hoa Cmt', 'Chuan hoa Ping',
    'Extract Ping', 'Extract Cmt', 'Tang 1 - FAQ Matching', 'Tang 0 - Chao hoi',
]
MONEY_RE = re.compile(r'(?<![\w.])(\d{1,2}\.\d{3}|\d{2,4})k(?![\w])')
PKG_RE = re.compile(r'goi (1|3|6|12|18|24|36) thang')


def norm(s):
    s = unicodedata.normalize('NFD', str(s).lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return s.replace('đ', 'd').replace('đ', 'd')


def check_text(label, text, require_full=False):
    fails = []
    n = norm(text)
    # 1) tiền lạ (không nằm trong bảng giá chuẩn)
    for m in MONEY_RE.finditer(n):
        tok = m.group(0)
        if tok not in {norm(x) for x in MONEY_WHITELIST}:
            fails.append(f"[{label}] SO TIEN LA: '{tok}' khong co trong bang gia chuan")
    # 2) facts cũ/sai
    for line in n.split('\n'):
        for bad in FORBIDDEN:
            if norm(bad) in line and not any(ok in line for ok in FORBID_OK_CTX):
                fails.append(f"[{label}] FACT CU/SAI: '{bad}' trong: {line.strip()[:100]}")
    # 3) giá/quà gắn nhầm gói — xét theo dòng (bullet mỗi gói 1 dòng) + theo câu
    for unit in re.split(r'[\n.!?]', n):
        pkgs = {int(x) for x in PKG_RE.findall(unit)}
        if len(pkgs) != 1:
            continue  # 0 gói hoặc nhiều gói trong 1 câu: bỏ qua (câu liệt kê)
        pkg = pkgs.pop()
        for price, p_pkg in {**PRICES, **BASE_PRICES}.items():
            if norm(price) in unit and p_pkg != pkg:
                fails.append(f"[{label}] GIA NHAM GOI: goi {pkg} thang di kem {price} (cua goi {p_pkg}): {unit.strip()[:100]}")
        if ('qua' in unit or 'tang' in unit):
            for g_pkg, toks in GIFT_TOKENS.items():
                for t in toks:
                    if t in unit and g_pkg != pkg:
                        fails.append(f"[{label}] QUA NHAM GOI: goi {pkg} thang di kem qua cua goi {g_pkg} ('{t}'): {unit.strip()[:100]}")
    # 4) bộ facts lõi phải có đủ (chỉ prompt AI chính)
    if require_full:
        for tok in REQUIRED_TOKENS:
            cands = [tok] + REQUIRED_ALTS.get(tok, [])
            if not any(norm(c) in n for c in cands):
                fails.append(f"[{label}] THIEU FACT LOI: '{tok}'")
    return fails


def walk(obj, out):
    """Gom node workflow + row cache từ mọi cấu trúc JSON."""
    if isinstance(obj, dict):
        if 'question_norm' in obj and 'answers' in obj:
            out['cache'].append(obj)
        if obj.get('name') in WATCH_NODES and isinstance(obj.get('parameters'), dict) and 'jsCode' in obj['parameters']:
            out['nodes'].setdefault(obj['name'], set()).add(obj['parameters']['jsCode'])
        for v in obj.values():
            walk(v, out)
    elif isinstance(obj, list):
        for v in obj:
            walk(v, out)


def main(paths):
    out = {'nodes': {}, 'cache': []}
    for p in paths:
        with open(p) as f:
            walk(json.load(f), out)
    fails = []
    for name, codes in out['nodes'].items():
        for code in codes:
            fails += check_text(f'node:{name}', code, require_full=(name in REQUIRED_FULL_NODES))
    seen = set()
    for row in out['cache']:
        key = (row.get('id'), row.get('question_norm'))
        if key in seen:
            continue
        seen.add(key)
        for i, ans in enumerate(row.get('answers') or []):
            fails += check_text(f"cache#{row.get('id')}:{row.get('question_norm')}[{i}]", ans)
    fails = sorted(set(fails))
    print(f"Da quet: {len(out['nodes'])} node theo doi, {len(seen)} cau cache.")
    if fails:
        print(f"\n❌ LECH FACTS: {len(fails)} van de\n" + '\n'.join(fails))
        return 1
    print('✅ SACH — toan bo prompt/guard/cache khop bang facts chuan.')
    return 0


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1:]))
