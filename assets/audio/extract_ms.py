import sys, json

cuefile = open(sys.argv[1], 'r')
ms_map = [{'chord': 0, 'ms': 0}]

for line in cuefile:
    if not line.startswith('    INDEX'):
        continue

    time = line.split()[2] # "00:01:23"
    ts = time.split(":")   # ["00","01","23"]

    ms =  int(ts[0]) * 60000 # minutes
    ms += int(ts[1]) * 1000 # seconds
    ms += int(ts[2]) * 1000 / 75 # frames
    ms = int(ms)

    ms_map.append({'chord': 1, 'ms': ms})
cuefile.close()

print(ms_map)
out_name = sys.argv[1].replace('.cue', '_map.json')

with open(out_name, 'w') as out_file:
    out_file.write(
        '[' +
        ',\n'.join(json.dumps(i) for i in ms_map) +
        ']\n'
    )
