local vehicleHUDActive = false
local playerHUDActive = false
local hunger = 100
local thirst = 100

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    Wait(500)
    startHUD()
end)

AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() ~= resourceName then return end
    Wait(500)
    startHUD()
end)

function startHUD()
    local ped = PlayerPedId()
    if not IsPedInAnyVehicle(ped) then
        DisplayRadar(false)
    else
        DisplayRadar(true)
        SendNUIMessage({ action = 'showVehicleHUD' })
    end
    TriggerEvent('hud:client:LoadMap')
    SendNUIMessage({ action = 'showPlayerHUD' })
    playerHUDActive = true
    loadPlayerNeeds()
end

local lastCrossroadUpdate = 0
local lastCrossroadCheck = {}

function getCrossroads(vehicle)
    local updateTick = GetGameTimer()
    if updateTick - lastCrossroadUpdate > 1500 then
        local pos = GetEntityCoords(vehicle)
        local street1, street2 = GetStreetNameAtCoord(pos.x, pos.y, pos.z)
        lastCrossroadUpdate = updateTick
        lastCrossroadCheck = { GetStreetNameFromHashKey(street1), GetStreetNameFromHashKey(street2) }
    end
    return lastCrossroadCheck
end

CreateThread(function()
    while true do
        local stamina = 0
        local playerId = PlayerId()
        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)
        if not IsPauseMenuActive() then
            if not playerHUDActive then SendNUIMessage({ action = 'showPlayerHUD' }) end
            if not IsEntityInWater(ped) then stamina = (100 - GetPlayerSprintStaminaRemaining(playerId)) end
            if IsEntityInWater(ped) then stamina = (GetPlayerUnderwaterTimeRemaining(playerId) * 10) end
            SendNUIMessage({
                action = 'updatePlayerHUD',
                health = (GetEntityHealth(ped) - 100),
                armor = GetPedArmour(ped),
                thirst = thirst,
                hunger = hunger,
                stamina = stamina,
                voice = LocalPlayer.state['proximity'].distance,
                talking = NetworkIsPlayerTalking(PlayerId()),
            })
            if IsPedInAnyVehicle(ped) and GetIsVehicleEngineRunning(vehicle) then
                if not vehicleHUDActive then
                    vehicleHUDActive = true
                    DisplayRadar(true)
                    TriggerEvent('hud:client:LoadMap')
                    SendNUIMessage({ action = 'showVehicleHUD' })
                end
                local crossroads = getCrossroads(vehicle)
                SendNUIMessage({
                    action = 'updateVehicleHUD',
                    speed = math.ceil(GetEntitySpeed(vehicle) * Config.speedMultiplier),
                    fuel = math.ceil(GetVehicleFuelLevel(vehicle)),
                    gear = GetVehicleCurrentGear(vehicle),
                    street1 = crossroads[1],
                    street2 = crossroads[2],
                    direction = GetDirectionText(GetEntityHeading(vehicle)),
                    rpm = GetVehicleCurrentRpm(vehicle),
                    engine = GetVehicleEngineHealth(vehicle)
                })
            else
                if vehicleHUDActive then
                    vehicleHUDActive = false
                    DisplayRadar(false)
                    SendNUIMessage({ action = 'hideVehicleHUD' })
                end
            end
        else
            vehicleHUDActive = false
            DisplayRadar(false)
            SendNUIMessage({ action = 'hideVehicleHUD' })
            SendNUIMessage({ action = 'hidePlayerHUD' })
            playerHUDActive = false
        end
        SetBigmapActive(false, false)
        SetRadarZoom(1000)
        Wait(Config.updateDelay)
    end
end)

function GetDirectionText(heading)
    if ((heading >= 0 and heading < 45) or (heading >= 315 and heading < 360)) then
        return "N"
    elseif (heading >= 45 and heading < 135) then
        return "W"
    elseif (heading >= 135 and heading < 225) then
        return "S"
    elseif (heading >= 225 and heading < 315) then
        return "E"
    end
end

RegisterNetEvent('hud:client:UpdateNeeds', function(newHunger, newThirst)
    thirst = newThirst
    hunger = newHunger
end)

RegisterNetEvent("hud:client:LoadMap", function()
    Wait(50)
    local defaultAspectRatio = 1920 / 1080
    local resolutionX, resolutionY = GetActiveScreenResolution()
    local aspectRatio = resolutionX / resolutionY
    local minimapOffset = 0
    if aspectRatio > defaultAspectRatio then
        minimapOffset = ((defaultAspectRatio - aspectRatio) / 3.6) - 0.008
    end

    -- Usamos la lógica de mapa cuadrado (tenemos squaremap.ytd en el stream)
    RequestStreamedTextureDict('squaremap', false)
    while not HasStreamedTextureDictLoaded('squaremap') do Wait(10) end

    SetMinimapClipType(0)
    AddReplaceTexture('platform:/textures/graphics', 'radarmasksm', 'squaremap', 'radarmasksm')
    AddReplaceTexture('platform:/textures/graphics', 'radarmask1g', 'squaremap', 'radarmasksm')

    -- Posicionamiento para cuadrado (Dalrae solve)
    SetMinimapComponentPosition('minimap', 'L', 'B', 0.0 + minimapOffset, -0.047, 0.1638, 0.183)
    SetMinimapComponentPosition('minimap_mask', 'L', 'B', 0.0 + minimapOffset, 0.0, 0.128, 0.20)
    SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.01 + minimapOffset, 0.025, 0.262, 0.300)

    SetBlipAlpha(GetNorthRadarBlip(), 0)
    SetMinimapClipType(0)
    SetRadarBigmapEnabled(true, false)
    Wait(50)
    SetRadarBigmapEnabled(false, false)
end)
