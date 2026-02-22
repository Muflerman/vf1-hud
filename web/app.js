$(document).ready(function () {
    function updatePlayerHUD(data) {
        // --- Health Logic ---
        // Always show health
        $('#health-bar').css('width', data.health + "%");
        $('#health-val').text(Math.ceil(data.health) + "%");

        // --- Armor Logic ---
        // Show only if armor > 0
        if (data.armor > 0) {
            $('#armor-row').removeClass('hidden');
            $('#armor-bar').css('width', data.armor + "%");
            $('#armor-val').text(Math.ceil(data.armor) + "%");
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
        // Velocidad y Marcha
        $('#speed').text(data.speed);
        $('#gear').text(data.gear == 0 ? 'R' : data.gear);

        // Efecto sensación de velocidad
        if (data.speed > 220) {
            $('#speed').addClass('speeding');
        } else {
            $('#speed').removeClass('speeding');
        }

        // Ubicación
        $('#street1').text(data.street1);
        $('#direction').text(data.direction);

        // Barras Verticales (Motor y Gasolina)
        // El motor suele venir de 0 a 1000
        let enginePercent = (data.engine / 1000) * 100;
        $('#engine-bar').css('height', enginePercent + "%");
        $('#fuel-bar').css('height', data.fuel + "%");

        // Lógica de Segmentos de RPM
        const maxSegments = 25;
        let rpmContainer = $('#rpm-segments');

        if (rpmContainer.children().length === 0) {
            for (let i = 0; i < maxSegments; i++) {
                rpmContainer.append('<div class="rpm-segment"></div>');
            }
        }

        // data.rpm viene de 0.0 a 1.0
        let activeCount = Math.floor(data.rpm * maxSegments);
        rpmContainer.children().each(function (index) {
            if (index < activeCount) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
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
                $('#vehicle-hud-container').fadeIn(400);
                break;
            case 'hideVehicleHUD':
                $('#vehicle-hud-container').fadeOut(400);
                break;
            case 'updateVehicleHUD':
                updateVehicleHUD(data);
                break;
        }
    });

    // Ocultar por defecto al cargar
    $('body').hide();
});