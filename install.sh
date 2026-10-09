#!/usr/bin/env bash
# Kept so `curl -fsSL https://daymug.com/install.sh | bash` keeps working:
# runs the installer shipped with the latest DayMug release, with any
# arguments passed through.
set -euo pipefail
installer="$(curl -fsSL https://github.com/DayMug/DayMug/releases/latest/download/install.sh)"
bash -c "$installer" install.sh "$@"
