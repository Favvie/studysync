#!/bin/bash

tmux new-session -d -s dev

tmux split-window -h -t dev
tmux split-window -h -t dev

tmux send-keys -t dev:0.0 "cd src && tsc --watch" C-m
tmux send-keys -t dev:0.1 "cd src && sleep 10 && npm run dev" C-m

# Check if the Redis container is already running
if [ "$(sudo docker ps -q -f name=local-redis)" ]; then
    echo "Redis container is already running"
else
    # Check if the Redis container exists but is stopped
    if [ "$(sudo docker ps -aq -f status=exited -f name=local-redis)" ]; then
        echo "Starting existing Redis container"
        tmux send-keys -t dev:0.2 "sudo docker start local-redis" C-m
    else
        echo "Creating and starting new Redis container"
        tmux send-keys -t dev:0.2 "sudo docker run --name local-redis -p 6379:6379 redis" C-m
    fi
fi

tmux attach-session -t dev