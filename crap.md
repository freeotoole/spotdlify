docker exec -it spotdl-dev bash
uvx --python 3.12 spotdl@latest download "https://open.spotify.com/track/3DCJHRfkDJV41F4oHYVxbR?si=4a8cab8e93a946a5"

spotdl download "https://open.spotify.com/track/5viH1NKDyMdZZKepbyTY8w?si=1d3fcc2f9c4c4527"

uvx --python 3.12 spotdl@latest download "https://open.spotify.com/track/3DCJHRfkDJV41F4oHYVxbR?si=4a8cab8e93a946a5"

curl -X POST http://localhost:4000/api/download \
 -H "Content-Type: application/json" \
 -d '{"url": "https://open.spotify.com/track/1wdxiLx8iKZLQSAwmOAgeZ?si=41c1c6a9c82f420d"}'

docker exec spotdl-dev spotdl download "https://open.spotify.com/track/1wdxiLx8iKZLQSAwmOAgeZ?si=41c1c6a9c82f420d" --output /music

docker exec spotdl-dev uvx --python 3.12 spotdl@latest download "https://open.spotify.com/track/75k2jy5PEiuZDzeuTPUKNW?si=aff1847db1d74b41" --output /music

skeletonwitch
https://open.spotify.com/track/5viH1NKDyMdZZKepbyTY8w?si=1d3fcc2f9c4c4527

pegz
https://open.spotify.com/track/75k2jy5PEiuZDzeuTPUKNW?si=aff1847db1d74b41

lucifer's fall

https://open.spotify.com/track/1wdxiLx8iKZLQSAwmOAgeZ?si=41c1c6a9c82f420d

Looks like something wrong with --output /music as it works when I run the script from docker to download a new song it works, when I hit the backend I get the correct response that file exists. e.g.

[spotifarr] Download requested: https://open.spotify.com/track/5viH1NKDyMdZZKepbyTY8w?si=1d3fcc2f9c4c4527
Processing query:  
 https://open.spotify.com/track/5viH1NKDyMdZZKepbyTY8w?si=1d3fcc2f9c4c4527  
Skipping Skeletonwitch - Fen of Shadows (file already exists) (duplicate)

But when I try to curl a new song from the backend it never completes, nor throws message, just sits as below indefinitely

[spotifarr] Download requested: https://open.spotify.com/track/1wdxiLx8iKZLQSAwmOAgeZ?si=41c1c6a9c82f420d
Processing query:  
https://open.spotify.com/track/1wdxiLx8iKZLQSAwmOAgeZ?si=41c1c6a9c82f420d
