#!/usr/bin/env python3
import sys, time, glob

def do_build(build):
    filename = build + ".html"
    if build == "release":
        filename = time.strftime("%Y%m%d%H%M-release.html")
    out = ""
    with open("index.tmpl", "r") as template:
        for line in template:
            if line.startswith("@"):
                targets, pattern = line.strip().split(maxsplit=1)
                targets = targets[1:].split(":")
                for target in targets:
                    if target == "all" or target == build:
                        for included in glob.glob(pattern):
                            with open(included, "r") as file:
                                out += file.read(-1) + "\n"
            else:
                out += line
    with open("build/" + filename, "w") as outfile:
        outfile.write(out)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        do_build(sys.argv[1])
    else:
        print("Usage: {0} <BUILD>".format(sys.argv[0]))
