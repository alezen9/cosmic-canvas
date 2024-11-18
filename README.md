# 🧑🏻‍🚀 Cosmic canvas

This project is my first standalone creation after completing the [Three.js Journey course](https://threejs-journey.com/certificate/view/3758). I've always been fascinated by the cosmos, and when I discovered shaders and their capabilities, I was immediately drawn to outer space: planets, galaxies, stars, and the vast beauty of the universe. Jupiter, with its captivating swirling patterns, felt like the perfect starting point: not too easy, not too difficult. To simplify the challenge, I opted for a more flat and stylized approach to its textures.

The journey has been incredibly rewarding, both in terms of the learning process and the final result. Through this project, I've deepened my understanding of concepts like procedural noise, polar coordinates, and lighting calculations, laying a solid foundation for future explorations in shader development.

<br />
<br />
<br />
<br />

# GLSL Jupiter Pattern Shader

![Preview](/public/jupiter-preview.png)

<br />
<br />

## 🌌 **What This Shader Does**

This shader creates a dynamic, procedural pattern inspired by planetary textures:

- **Procedural stripes** with noise-driven edges for a more organic feel.
- **Concentric Ellipses** to represent the Great Red Spot, layered with noise for added detail.
- **Seamless texture mapping** to ensure no visible vertical seams.
- **Lighting and shading** using ambient, point, and specular lighting to add depth.
- **Fresnel effects** for a subtle atmospheric touch near the edges.

## 🛠 **Learnings and Challenges**

### 1. **Polar Coordinates and Seamless Mapping**

One of the first challenges was understanding how to map UV coordinates onto a sphere using polar coordinates. This helped me ensure the texture wraps seamlessly, avoiding a **vertical seam**. I’m aware of the "stretch" at the equator caused by polar coordinates, this remains a challenge for another time.

### 2. Setting up the environment

Beyond the shader itself, I spent time setting up the surrounding environment to bring the scene to life. This included:

- Adding a starfield background, using the Drei library for simplicity and focusing on the planet.
- Configuring the sun, satellites orbiting the planet, and their trails.
- Setting up the rotation, inclination, and scale of the gas giant and its surroundings for a realistic yet stylized feel.
- Constraining the camera to maintain a good perspective and adjusting its initial position.

I also explored environment maps, experimenting with formats like `HDR`, `EXR`, and even the super-optimized `KTX`. While learning about these formats was fascinating, I ultimately chose to use the Drei `<Stars />` component for simplicity since the shader and planet were the main focus.

### 3. **Noise Exploration**

I experimented with both **texture-based noise** and **procedural noise** (Simplex Noise). Procedural noise provided more detail and control, making it the better choice for this shader. I also learned about **layering noise** (octaves), where multiple noise layers with varying frequencies and intensities are combined for richer patterns. Balancing these layers is key: too much noise affects performance and visual clarity.

### 4. **GLSL Functions**

Working with GLSL’s `step`, `smoothstep`, and `mix` functions taught me how to manipulate patterns and blend colors effectively:

- `mix` is especially powerful; it’s optimized to run as a single GPU instruction, making it efficient for blending. It works great for **drawing over** patterns, like using ellipses to overwrite stripes.
- Avoiding `if`-statements and loops where possible is a performance best practice I discovered during this project.

### 5. **Color Selection and Stripes**

Finding the right colors for each stripe, deciding how many stripes to include, and adjusting their sizes took a lot of trial and error. After extensive tweaking, I’m happy enough with the current result, though there’s always room for refinement.

### 6. **Lighting and Shading**

Adding ambient, point, and specular lighting gave the sphere depth, while Fresnel effects added an atmospheric glow. It was interesting to see how different lighting parameters affect the final look.

### 7. **Combining Colors**

I learned that using `color += newColor * factor` layers colors, while `mix(color, newColor, factor)` replaces them. This understanding helped me layer patterns effectively, such as drawing ellipses on top of stripes.

<br />
<br />

## 🔬 **Techniques and Strategies**

- **Seamless Mapping:** By scaling noise contributions based on polar coordinates, I avoided vertical seams while mapping the texture onto the sphere.
- **Layering Noise:** Combining noise at different frequencies and scales creates more detailed patterns but needs careful balancing for performance and aesthetics.
- **Lighting:** Ambient, point, and specular lighting (Blinn-Phong) were implemented for depth, with Fresnel effects for subtle highlights near the edges.
- **Optimized Noise Usage:** Noise was calculated once in the main function and reused across stripes and ellipses, improving performance without compromising the visual result.

<br />
<br />

## 🚀 **Key Takeaways**

- I feel more confident in shader development, especially with GLSL, noise, and 3D pattern design.
- I’m also aware that I still have a lot to learn and practice to refine these skills further. This is just a small step in a long journey.

<br />
<br />

## ✨ **Future Improvements**

While I’m happy with the current result, there are areas I could explore further:

- Addressing the equatorial stretch caused by polar coordinates.
- Experimenting with more advanced noise algorithms, like 3D noise.
- Continuing to refine the colors, stripe sizes, and noise parameters.
- Implementing turbulences and swirls for more dynamic, fluid-like patterns.
- Smoothing transitions between one color and another for a more blended, gradient-like effect.

<br />
<br />

## 📝 **Final Thoughts**

This project has been a rewarding experience, helping me deepen my understanding of shader programming and procedural design. While there’s still much to learn, I enjoyed the process of turning concepts into a tangible result and look forward to continuing this journey.
