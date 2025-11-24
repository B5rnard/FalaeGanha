# FalaeGanha - Image Generation Guide

This document provides step-by-step instructions for generating custom images for the FalaeGanha speech practice game using Google ImageFX.

## Quick Start

1. Generate 5 images using ImageFX (prompts provided below)
2. Download and rename them according to the filenames listed
3. Upload them to the `/images` folder in your GitHub repository
4. The game will automatically use your new images!

## Image Requirements

- **Format**: PNG (recommended) or JPG
- **Dimensions**: 800x600px or landscape ratio (16:9 or 4:3)
- **File size**: Keep under 500KB per image for fast loading
- **Style**: Clear, bright, child-friendly, realistic or illustrated
- **Quality**: High resolution for clarity on all devices

## How to Generate Images with ImageFX

### Step-by-Step Process:

1. **Visit ImageFX**: Go to [Google ImageFX](https://aitestkitchen.withgoogle.com/tools/image-fx)
2. **Sign in**: Use your Google account
3. **Enter prompt**: Copy the prompt provided for each image below
4. **Generate**: Click generate and wait for results
5. **Select best image**: Choose the clearest, most appropriate image
6. **Download**: Click download to save the image
7. **Rename**: Rename the file to match the filename specified
8. **Upload to GitHub**: Follow the upload instructions at the bottom

### Tips for Best Results:
- If the first generation isn't perfect, try regenerating or tweaking the prompt
- Look for images with good lighting and clear focus
- Choose images that are child-friendly and not too complex
- Prefer images without text or watermarks

---

## Image 1: Boy Eating Pizza

**Sentence**: "O menino está comendo pizza"
**Question**: "O que está acontecendo?"
**Filename**: `boy-eating-pizza.png`

### ImageFX Prompt:
```
A young boy around 8-10 years old happily eating a slice of pizza, holding the pizza slice in his hands, cheerful expression, sitting at a table in a bright casual setting like a kitchen or dining room, natural lighting, child-friendly scene, clear and simple composition, photorealistic style
```

### Alternative Prompts (if needed):
- "Happy young boy eating pizza slice, bright kitchen background, natural photo"
- "Child enjoying pizza at home, warm lighting, clear simple scene"

### What to Look For:
- Boy is clearly visible and eating pizza
- Pizza slice is visible in his hands
- Happy, natural expression
- Good lighting and clear focus
- Simple, uncluttered background

---

## Image 2: Girl Drinking Juice

**Sentence**: "A menina está bebendo suco"
**Question**: "O que está acontecendo?"
**Filename**: `girl-drinking-juice.png`

### ImageFX Prompt:
```
A young girl around 8-10 years old drinking juice from a glass, holding the glass with both hands, happy expression, sitting at a table, bright natural lighting, visible juice in the glass (orange or apple juice), casual home setting, child-friendly scene, clear and simple composition, photorealistic style
```

### Alternative Prompts (if needed):
- "Happy girl drinking orange juice from glass, bright kitchen, natural photo"
- "Child enjoying juice at home, clear glass visible, warm lighting"

### What to Look For:
- Girl is clearly visible drinking from glass
- Glass and juice are visible
- Natural, happy expression
- Good lighting and clear focus
- Simple background

---

## Image 3: Dog Running in Park

**Sentence**: "O cachorro está correndo no parque"
**Question**: "O que está acontecendo?"
**Filename**: `dog-running-park.png`

### ImageFX Prompt:
```
A friendly dog running through a park, active motion visible with legs in motion, green grass and trees in background, bright sunny day, outdoor park setting with clear blue sky, happy energetic dog expression, natural daylight, clear focus on the dog, photorealistic style, child-friendly scene
```

### Alternative Prompts (if needed):
- "Happy dog running on grass in park, trees in background, sunny day"
- "Energetic dog mid-run in outdoor park, green grass, clear daylight"

### What to Look For:
- Dog is clearly running (motion visible)
- Park setting is obvious (grass, trees)
- Bright, clear daylight
- Friendly, happy dog (golden retriever, labrador, or similar)
- Simple, natural background

---

## Image 4: Car in Garage

**Sentence**: "O carro está na garagem"
**Question**: "Onde está o carro?"
**Filename**: `car-in-garage.png`

### ImageFX Prompt:
```
A car parked inside a residential garage, clear view of both the car and garage interior, garage walls and door visible, clean organized garage with good lighting, front or side view of car showing it's parked inside, modern residential setting, clear and simple composition, photorealistic style
```

### Alternative Prompts (if needed):
- "Car parked in home garage, garage interior visible, well-lit clean setting"
- "Vehicle inside residential garage, clear garage walls and car visible"

### What to Look For:
- Car is clearly inside a garage
- Garage setting is obvious (walls, garage door visible)
- Good lighting showing both car and garage
- Clean, not cluttered
- Residential garage (not commercial/industrial)

---

## Image 5: Book on Table

**Sentence**: "O livro está em cima da mesa"
**Question**: "Onde está o livro?"
**Filename**: `book-on-table.png`

### ImageFX Prompt:
```
A book sitting on top of a wooden table, clear view of the book and table surface, simple clean composition, good natural lighting from window or overhead light, book can be closed or slightly open, home or study setting, uncluttered background, warm inviting atmosphere, photorealistic style
```

### Alternative Prompts (if needed):
- "Single book on wooden table surface, natural lighting, simple clean scene"
- "Book resting on table top, clear view, bright interior lighting"

### What to Look For:
- Book is clearly visible on the table
- Table surface is clearly visible
- Clean, simple composition
- Good lighting (not too dark)
- Not cluttered with other objects

---

## How to Upload Images to GitHub

Once you've generated and renamed all 5 images, follow these steps:

### Method 1: GitHub Web Interface (Easiest)

1. Go to your GitHub repository: `https://github.com/B5rnard/FalaeGanha`
2. Navigate to the `/images` folder
3. Click the **"Add file"** button
4. Select **"Upload files"**
5. Drag and drop all 5 images at once, or click "choose your files"
6. Add a commit message (e.g., "Add custom generated images for game")
7. Click **"Commit changes"**
8. Done! The game will now use your images

### Method 2: Git Command Line

```bash
# Navigate to your project folder
cd FalaeGanha

# Copy your images to the images folder
cp ~/Downloads/boy-eating-pizza.png images/
cp ~/Downloads/girl-drinking-juice.png images/
cp ~/Downloads/dog-running-park.png images/
cp ~/Downloads/car-in-garage.png images/
cp ~/Downloads/book-on-table.png images/

# Add and commit
git add images/
git commit -m "Add custom generated images for game"
git push
```

---

## Testing Your Images

After uploading images:

1. Open your game in the browser (via GitHub Pages or locally)
2. Play through all 5 scenes to verify images load correctly
3. Check that images are clear and appropriate for your son
4. Verify images display well on different screen sizes
5. If an image doesn't work, check the filename matches exactly

---

## Troubleshooting

**Images not showing?**
- Check that filenames match exactly (case-sensitive)
- Ensure files are in PNG or JPG format
- Verify files are in the `/images` folder, not a subfolder
- Clear your browser cache and reload

**Image looks wrong?**
- Simply regenerate in ImageFX with a modified prompt
- Download the new version
- Replace the file in the `/images` folder

**Image too large?**
- Use an online image compressor (like TinyPNG.com)
- Or regenerate with ImageFX and download a smaller version

---

## Summary Checklist

- [ ] Visit ImageFX and sign in
- [ ] Generate image 1: boy-eating-pizza.png
- [ ] Generate image 2: girl-drinking-juice.png
- [ ] Generate image 3: dog-running-park.png
- [ ] Generate image 4: car-in-garage.png
- [ ] Generate image 5: book-on-table.png
- [ ] Rename all files to match the filenames exactly
- [ ] Upload all 5 images to GitHub `/images` folder
- [ ] Test the game to verify images load correctly
- [ ] Celebrate! Your custom game is ready!
