#!/usr/bin/fish

# Create favicon.ico from ./elevation-app.svg

echo creating favicon.ico
magick -background none ./elevation-app.svg -resize 48x48 ./favicon.ico

# Create icon-{72,96,128,144,152,192,384,512}.png from ./elevation-app.svg

for size in 72 96 128 144 152 192 384 512
  echo creating icons/icon-{$size}x{$size}.png
  magick -background none ./elevation-app.svg -resize {$size}x{$size} ./icons/icon-{$size}x{$size}.png
end
