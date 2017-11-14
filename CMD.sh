#!/usr/bin/env bash
if [[ "$DEBUGGING" == "yes" ]]; then
    node --inspect-brk=0.0.0.0:5858 lib/start.js
else
    node lib/start.js
fi