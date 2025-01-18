#!/bin/bash

# Create a new tmux session named "dev" if it doesn't exist
tmux new-session -d -s dev

# Split the window horizontally
tmux split-window -h

cd 'src/'

# Send the tsc --watch command to the first pane
tmux send-keys -t dev:0.0 "tsc --watch" C-m

# Send the npm run dev command to the second pane
tmux send-keys -t dev:0.1 "npm run dev" C-m

# Attach to the tmux session
tmux attach-session -t dev