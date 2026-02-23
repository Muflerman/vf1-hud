# VF1 Premium HUD
Rediseño completo y optimizado del HUD para FiveM por **mfl-scrpts**.

![134269fa65955b72aa6799897648fabb](https://github.com/user-attachments/assets/1441c5bc-abe1-4471-a672-52b010509ede)

🎮 vf1-hud

A premium, modern, and highly optimized HUD for FiveM servers.
Designed to provide a clean interface, smooth performance, and an immersive player experience.

🙏 Acknowledgements

This resource is a deep rework based on the original mt-hud.
Special thanks to MT-Scripts for providing the excellent foundation on which this new premium design was built.

✨ Main Features
👤 Dynamic Player HUD

*   **Intelligent Visibility:** HUD stays hidden during selection screens (multicharacter), spawn menus, and pause menu. Only appears once the player is logged in.
*   **Dynamic Health Bar:** Smart color transition from neon green to deep red.
*   **Dynamic Armor Bar:** Premium blue-to-white gradient. Only visible if armor > 0.
*   **Anchored Stability:** The HUD is anchored to the bottom. When Armor appears, it grows upwards without shifting existing elements down.
*   **Hunger & Thirst:** Clean indicators with smooth updates and compact layout.
*   **Voice indicator:** Integrated voice range feedback with whisper/normal/shout labels.

🎤 Smart Voice System
*   **Labels:** Susurrar (Whisper), Normal, Gritar (Shout).
*   **Activity:** Green neon glow when the player is actively speaking.

🏃 Centered Stamina Bar
*   **Design:** Premium stamina bar centered at the bottom of the screen.
*   **Oxygen:** Automatically switches to oxygen tracking when underwater.
*   **Visibility:** Only appears during physical activity or when stamina is being used.

🚗 Premium Car HUD (Redesigned)

*   **Engine-Based Visibility:** Strictly tied to vehicle engine state. Only appears when the engine is running and player is inside.
*   **Horizontal Fuel Bar:** Redesigned horizontal fuel gauge integrated under the KM/H unit with dynamic colors (Green/Yellow/Red).
*   **Status Icons System:** Premium indicators for **Engine, Lights, Lock Status, and Seatbelt**.
    *   **Neon Green:** Safe/Active status.
    *   **Intense Red:** Alert/Warning/Inactive status.
*   **Segmented RPM bar:** 20-segment high-performance visualizer with critical red zone.
*   **Street Info & Compass:** Anchored next to the minimap showing current street, crossroad, and compass direction in a styled box.
*   **High-contrast Speedometer:** Large numbers with zero-padding and dimming effect.
*   **Vibration effect:** Immersive shaking and color shift warning at high speeds (> 220 KMH).

✨ Interface Cleanliness
*   **Zero-Flicker Native Hiding:** Deep integration to hide default GTA V components (Vehicle Name, Area, Street, etc.) ensuring they never flash.
*   **Optimized Map Alignment:** Square minimap perfectly aligned with a premium border across all aspect ratios.
*   **UI Anchoring:** All elements are fixed to prevent "jumping" when names change or HUD items appear/disappear.

🗺 Optimized Square Minimap

Based on the "Dalrae solve"

Automatically adjusts to all screen resolutions

⚡ Extreme Optimization

100ms update interval

Ultra low resmon usage: 0.01ms – 0.03ms

Built for performance without sacrificing visual quality.

🛠 Dependencies

qb-core or qbx_core

ox_lib
