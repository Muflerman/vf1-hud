$(document).ready(function () {
    function updatePlayerHUD(data) {
        // --- Health Logic ---
        // Always show health
        $('#health-bar').css('width', data.health + "%");
        $('#health-val').text(Math.ceil(data.health) + "%");

        // Color transition: 120 (green) to 0 (red)
        const hue = (data.health * 1.2); // 100% -> 120deg, 0% -> 0deg
        const color = `hsl(${hue}, 100%, 45%)`;
        $('#health-bar').css({
            'background-color': color,
            'box-shadow': `0 0 10px hsla(${hue}, 100%, 45%, 0.5)`
        });

        // --- Armor Logic ---
        // Show only if armor > 0
        if (data.armor > 0) {
            $('#armor-row').removeClass('hidden');
            $('#armor-bar').css('width', data.armor + "%");
            $('#armor-val').text(Math.ceil(data.armor) + "%");

            // Color transition: Blue (100%) to White (0%)
            const sat = data.armor;
            const light = 100 - (data.armor / 2); // 100% armor -> 50% light, 0% armor -> 100% light
            const armorColor = `hsl(195, ${sat}%, ${light}%)`;
            $('#armor-bar').css({
                'background-color': armorColor,
                'box-shadow': `0 0 10px hsla(195, ${sat}%, ${light}%, 0.5)`
            });
        } else {
            $('#armor-row').addClass('hidden');
        }

        // --- Hunger Logic ---
        $('#hunger-bar').css('width', data.hunger + "%");
        $('#hunger-val').text(Math.ceil(data.hunger) + "%");

        // --- Thirst Logic ---
        $('#thirst-bar').css('width', data.thirst + "%");
        $('#thirst-val').text(Math.ceil(data.thirst) + "%");

        // --- Stamina / Oxygen Logic ---
        // In this local script, stamina value seems to be 'used amount' (0 when full, 100 when tired) 
        // OR 'oxygen remaining' when in water.
        // We show it only if it's not at its default state.
        if (data.stamina > 0 && data.stamina < 100) {
            $('#stamina-container').removeClass('hidden');
            $('#stamina-bar').css('width', data.stamina + "%");
            $('#stamina-val').text(Math.ceil(data.stamina) + "%");
        } else {
            $('#stamina-container').addClass('hidden');
        }

        // --- Voice Logic ---
        let voiceDist = "normal";
        let voiceWidth = "50%";

        if (data.voice <= 1.5) {
            voiceDist = "susurrar";
            voiceWidth = "30%";
        } else if (data.voice <= 3.0) {
            voiceDist = "normal";
            voiceWidth = "60%";
        } else {
            voiceDist = "gritar";
            voiceWidth = "100%";
        }

        $('#voice-bar').css('width', voiceWidth);
        $('#voice-val').text(voiceDist);

        if (data.talking) {
            $('#voice-icon').css('color', '#00ffcc'); // Color neon cuando habla
        } else {
            $('#voice-icon').css('color', '#fff');
        }
    }

    function updateVehicleHUD(data) {
        // Velocidad con padding de ceros y opacidad en ceros a la izquierda
        let speed = Math.floor(data.speed);
        let speedStr = speed.toString().padStart(3, '0');
        let speedHtml = '';
        let leading = true;

        for (let i = 0; i < speedStr.length; i++) {
            if (speedStr[i] !== '0') leading = false;
            // El último dígito nunca es dim, y los ceros a la izquierda sí
            let isDim = leading && i < speedStr.length - 1;
            speedHtml += `<span class="${isDim ? 'dim' : ''}">${speedStr[i]}</span>`;
        }
        $('#speed').html(speedHtml);

        // Marcha Activa (Simple: Icono + Número)
        let currentGear = data.gear;
        if (currentGear == 0) currentGear = 'R';
        if (data.speed == 0 && currentGear != 'R') currentGear = 'N';
        $('#gear').text(currentGear);

        // Lógica de RPM (Barra Segmentada)
        const maxRpmSegments = 20;
        let rpmBar = $('#rpm-bar');

        if (rpmBar.children().length !== maxRpmSegments) {
            rpmBar.empty();
            for (let i = 0; i < maxRpmSegments; i++) {
                rpmBar.append('<div class="rpm-segment"></div>');
            }
        }

        let activeRpmCount = Math.floor(data.rpm * maxRpmSegments);
        rpmBar.children().each(function (index) {
            if (index < activeRpmCount) {
                $(this).addClass('active');
                // Los últimos 4 segmentos son críticos (rojos)
                if (index >= maxRpmSegments - 4) {
                    $(this).addClass('critical');
                } else {
                    $(this).removeClass('critical');
                }
            } else {
                $(this).removeClass('active critical');
            }
        });

        // Efecto sensación de velocidad
        if (data.speed > 220) {
            $('#speed').addClass('speeding');
        } else {
            $('#speed').removeClass('speeding');
        }

        // Combustible (Horizontal) con colores dinámicos
        $('#fuel-fill').css('width', data.fuel + "%");

        let fuelColor = '#00ffcc'; // Verde por defecto
        if (data.fuel <= 25) {
            fuelColor = '#ff3b3b'; // Rojo crítico
        } else if (data.fuel <= 65) {
            fuelColor = '#ffcf4b'; // Amarillo medio
        }

        $('#fuel-fill').css({
            'background': fuelColor,
            'box-shadow': `0 0 10px ${fuelColor}80` // Glow dinámico (80 es opacidad hex)
        });

        // Iconos de Estado (Engine, Lights, Doors, Seatbelt)
        // Motor (Verde si está sano, Rojo si está dañado)
        if (data.engine >= 600) {
            $('#engine-status').addClass('active');
        } else {
            $('#engine-status').removeClass('active');
        }

        // Luces (Verde si están encendidas, Rojo si están apagadas)
        if (data.lights) {
            $('#lights-status').addClass('active');
        } else {
            $('#lights-status').removeClass('active');
        }

        // Bloqueo de Puertas (Verde si está CERRADO, Rojo si está ABIERTO)
        if (data.doors) {
            $('#doors-status').addClass('active');
        } else {
            $('#doors-status').removeClass('active');
        }

        // Cinturón (Verde si está PUESTO, Rojo si NO está puesto)
        if (data.seatbelt) {
            $('#seatbelt-status').addClass('active');
        } else {
            $('#seatbelt-status').removeClass('active');
        }

        // --- Calles y Dirección ---
        $('#direction').text(data.direction);
        $('#street-1').text(data.street1);
        $('#street-2').text(data.street2 || ""); // Si no hay cruce, vacío
    }

    window.addEventListener('message', function (event) {
        const data = event.data;
        switch (data.action) {
            case 'showPlayerHUD':
                $('body').fadeIn(400);
                break;
            case 'hidePlayerHUD':
                $('body').fadeOut(400);
                break;
            case 'updatePlayerHUD':
                updatePlayerHUD(data);
                break;
            case 'showVehicleHUD':
                $('#vehicle-hud-new').css('display', 'flex').hide().fadeIn(400);
                $('#street-container').removeClass('hidden').hide().fadeIn(400);
                break;
            case 'hideVehicleHUD':
                $('#vehicle-hud-new').fadeOut(400);
                $('#street-container').fadeOut(400, function () {
                    $(this).addClass('hidden');
                });
                break;
            case 'updateVehicleHUD':
                updateVehicleHUD(data);
                break;
        }
    });

    // Ocultar por defecto al cargar
    $('body').hide();
});