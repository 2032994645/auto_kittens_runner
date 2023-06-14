let second_tick = 0
try{clearInterval(game_upgrade_timer)}catch (e) {}
game_upgrade_timer = setInterval(()=>{
    second_tick += 1
    show_message()
    hold_festival()

    upgrade_all_science()
    upgrade_all_workshop()
    upgrade_all_embassy()

    record_game_data()
    auto_assign_kittens()
    auto_craft()
    auto_praise()
    auto_up_building_stage()

    auto_upgrade_building()
    auto_assgin_building_on()
    auto_incr_resource_priority()

    auto_trade()
    auto_space()

    observe_the_sky()

    if (is_send_explorers()){
        send_explorers()
    }

    if (is_resource_will_full('manpower', 0.99)
        || (is_base_resource_short_for_upgrade('furs') && is_tick_match_cycle(10))){
        send_hunters(Math.max(10, Math.ceil(get_resource_ratio('manpower') / 100)))
    }

    if (get_current_year() >= 5 && !has_page('Trade')){
        this.game.diplomacyTab.visible = true;
        this.game.diplomacy.update()
        updateUI()
    }

    if (second_tick > Number.MAX_SAFE_INTEGER - 10){
        second_tick = 0
    }
}, 1000)

function get_bonfire_building_dataset(){
    return this.game.bld.buildingsData
}

function get_space_planet_dataset(){
    return this.game.space.planets
}

function is_config_short_resource(res_name) {
    return get_config_short_resources().includes(res_name)
}

function get_config_short_resources() {
    let result = []
    let res_options = auto_options.resource
    for (var res_name in res_options){
        let res_option = res_options[res_name]
        if (res_option.festivalWillEnd){
            let festivalWillEnd_option = res_option.festivalWillEnd
            if (festivalWillEnd_option.asShortRes){
                let asShortRes_option = festivalWillEnd_option.asShortRes
                let is_match = true
                for (var key in asShortRes_option){
                    if (!is_match_obj_config(key, asShortRes_option[key])){
                        is_match = false
                        break
                    }
                }

                if (is_match && this.game.calendar.festivalDays <= festivalWillEnd_option.scope[1]
                    && this.game.calendar.festivalDays >= festivalWillEnd_option.scope[0]){
                    result.push(res_name)
                }
            }
        }
    }

    return result
}

function get_res_dataset(){
    return this.game.resPool.resourceData
}

function is_building_match_craft_condition(bld_name, planet='earth', is_log=false){
    let resource_options = auto_options.craft.resource
    for (var res_name in resource_options){
        let resource_option = resource_options[res_name]
        if (resource_option.condition){
            let condition_option = resource_option.condition
            if (condition_option.priority && has_priority_resource()){
                let short_res = short_resource()
                let srcBuildingNoUpgrade_value = condition_option.priority.srcBuildingNoUpgrade
                if (is_log) console.log(1, res_name, short_res, bld_name, srcBuildingNoUpgrade_value)
                if (short_res.type = 'craft' && short_res.name == res_name && srcBuildingNoUpgrade_value){
                    if (is_log) console.log(2, res_name, srcBuildingNoUpgrade_value)
                    for (var j in srcBuildingNoUpgrade_value){
                        if (is_building_upgrade_need_resource(bld_name, srcBuildingNoUpgrade_value[j], planet)){
                            return false
                        }
                    }
                }
            }
        }
    }

    if (has_priority_resource()){
        //注意：是否不升级有重叠资源的建筑
        let short_res = short_resource()
        if (short_res.type == 'upgrade'){
            if (!is_resource_satisfy(get_workshop_upgrade_prices(short_res.name), get_building_prices(bld_name, planet))){
                return false
            }
        }

        if (short_res.type == 'tech'){
            if (!is_resource_satisfy(get_science_prices(short_res.name), get_building_prices(bld_name, planet))){
                return false
            }
        }

        if (short_res.type == 'building'){
            if (!is_resource_satisfy(get_building_prices(short_res.name, short_res.planet), get_building_prices(bld_name, planet))){
                return false
            }
        }

        if (short_res.type == 'craft'){
            if (!is_resource_satisfy(get_craft_prices(short_res.name, planet), get_building_prices(bld_name, planet))){
                return false
            }
        }
    }

    return true
}

function is_building_match_upgrade_condition(bld_name, planet='earth', is_log=false){
    let bld_upgrade_option = auto_options.building.upgrade[bld_name]
    if (bld_upgrade_option && bld_upgrade_option.condition) {
        var condition = bld_upgrade_option.condition
        let res_dataset = get_res_dataset()
        for (var i in res_dataset) {
            var res_data = res_dataset[i]
            if (condition[res_data.name + 'MinRatio'] != undefined) {
                if (get_resource_ratio(res_data.name) < condition[res_data.name + 'Ratio']) {
                    return false
                }
            }
        }
    }

    if (is_log) console.log('is_other_factor_effect_when_upgrade:', bld_name, planet, is_other_factor_effect_when_upgrade(bld_name, planet))
    if (is_other_factor_effect_when_upgrade(bld_name, planet, is_log))return false
    return true
}

function is_building_match_incr_priority_condition(bld_name, planet='earth'){
    let bld_upgrade_option = auto_options.building.upgrade[bld_name]
    if (bld_upgrade_option == undefined)return false
    var incr_priority_option = bld_upgrade_option.incr_priority
    if (incr_priority_option == undefined)return false
    var bld_obj = get_building(bld_name, planet)

    for(var option_key in incr_priority_option){
        if (!is_match_obj_config(option_key, incr_priority_option[option_key])){
            return false
        }
    }

    if (incr_priority_option['val'+bld_obj.val]){
        let incr_priority_option_valX = incr_priority_option['val'+bld_obj.val]
        for(var valX_key in incr_priority_option_valX){
            if (!is_match_obj_config(valX_key, incr_priority_option_valX[valX_key])){
                return false
            }
        }
    }

    if (incr_priority_option['valX']){
        let incr_priority_option_valX = incr_priority_option['valX']
        for(var valX_key in incr_priority_option_valX){
            if (!is_match_obj_config(valX_key, incr_priority_option_valX[valX_key])){
                return false
            }
        }
    }

    return false
}

function is_match_tech_config(config_value=[]){
    for (var i in config_value){
        if (!is_science_researched(config_value[i])){
            return false
        }
    }
    return true
}

function is_match_upgrades_config(config_value=[]){
    for (var i in config_value){
        if (!is_workshop_researched(config_value[i])){
            return false
        }
    }
    return true
}

function split_program_and_type(config_key){
    let program_dataset = this.game.space.programs
    for(var i in program_dataset) {
        var program_data = program_dataset[i]
        if (config_key.startsWith(program_data.name)){
            return {name: program_data.name, type: config_key.slice(program_data.name.length)}
        }
    }
    return null
}

function split_earth_bld_and_type(config_key){
    let building_dataset = get_bonfire_building_dataset()
    for(var i in building_dataset) {
        var building_data = building_dataset[i]
        if (config_key.startsWith(building_data.name)){
            return {name: building_data.name, type: config_key.slice(building_data.name.length)}
        }
    }
    return null
}

function is_match_earth_bld_config(config_key, config_value, is_log=false){
    let config_option = split_earth_bld_and_type(config_key)
    //非设定的 building_name + type，都认为是匹配的
    if (!config_option)return true
    let building = get_bonfire_building(config_option.name)

    if (config_option.type == 'EarthBldUnlocked'){
        if (is_log)  console.log(config_key, building, building.unlocked, config_value)
        if (building.unlocked == config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'EarthBldValGe'){
        if (is_log)  console.log(config_key, building, building.val, config_value)
        if (building.val >= config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'EarthBldValLe'){
        if (is_log)  console.log(config_key, building, building.val, config_value)
        if (building.val <= config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'EarthBldOnGe'){
        if (is_log)  console.log(config_key, building, building.on, config_value)
        if (building.on >= config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'EarthBldOnLe'){
        if (is_log)  console.log(config_key, building, building.on, config_value)
        if (building.on <= config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'EarthBldConRes'){
        if (is_log)  console.log(config_key, building, is_building_con_resource(config_option.name, config_value), config_value)
        if (is_building_con_resource(config_option.name, config_value)){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'EarthBldPromoteRes'){
        if (is_log)  console.log(config_key, building, is_building_promote_resource(config_option.name, config_value), config_value)
        if (is_building_promote_resource(config_option.name, config_value)){
            return true
        }else{
            return false
        }
    }


    if (config_option.type == 'EarthBldIsLimited'){
        if (is_build_resource_limited(config_option.name) == config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'EarthBldIsPriority'){
        if (!has_priority_resource())return false
        if (short_resource().name == config_option.name){
            if (config_value)return true
            else return false
        }else{
            if (!config_value)return true
            else return false
        }
    }

    if (config_option.type == 'EarthBldUpgradeResEnough'){
        if(config_value.value == undefined){
            console.error(config_key, config_value, 'config error: lost value')
            return false
        }
        let prices = get_building_prices(config_option.name)
        for (var i in config_value.value){
            if(is_log) console.log(config_option, config_value, prices, config_value.value[i], is_specific_resource_enough(prices, config_value.value[i]))
            if (!is_specific_resource_enough(prices, config_value.value[i])){
                return false
            }
        }

        return true
    }

    return true
}

function split_space_bld_and_type(config_key){
    let planet_dataset = this.game.space.planets
    for(var i in planet_dataset) {
        for ( var j in planet_dataset[i].buildings) {
            var building_data = planet_dataset[i].buildings[j]
            if (config_key.startsWith(building_data.name)) {
                return {name: building_data.name, type: config_key.slice(building_data.name.length)}
            }
        }
    }
    return null
}

function is_match_space_bld_config(config_key, config_value, is_log=false){
    if (!has_page("Space")){
        if (config_key.includes('SpaceBld'))return false
        return true
    }
    let config_option = split_space_bld_and_type(config_key)
    //非设定的 building_name + type，都认为是匹配的
    if (!config_option)return true
    let building = get_space_building(config_option.name)
    let planet = get_space_planet_of_building(config_option.name)

    if (config_option.type == 'SpaceBldUnlocked'){
        if (is_log) console.log(config_key, building, building.unlocked, config_value)
        if (building.unlocked == config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'SpaceBldValGe'){
        if (is_log)  console.log(config_key, building, building.val, config_value)
        if (building.val >= config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'SpaceBldValLe'){
        if (is_log)  console.log(config_key, building, building.val, config_value)
        if (building.val <= config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'SpaceBldOnGe'){
        if (is_log)  console.log(config_key, building, building.on, config_value)
        if (building.on >= config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'SpaceBldOnLe'){
        if (is_log)  console.log(config_key, building, building.on, config_value)
        if (building.on <= config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'SpaceBldConRes'){
        if (is_log)  console.log(config_key, building,
            is_building_con_resource(config_option.name, config_value, planet.name), config_value)
        if (is_building_con_resource(config_option.name, config_value, planet.name)){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'SpaceBldPromoteRes'){
        if (is_log)  console.log(config_key, building,
            is_building_promote_resource(config_option.name, config_value, planet.name), config_value)
        if (is_building_promote_resource(config_option.name, config_value, planet.name)){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'SpaceBldIsLimited'){
        if (is_build_resource_limited(config_option.name, planet.name) == config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'SpaceBldIsPriority'){
        if (!has_priority_resource())return false
        if (short_resource().name == config_option.name){
            if (config_value)return true
            else return false
        }else{
            if (!config_value)return true
            else return false
        }
    }

    if (config_option.type == 'SpaceBldUpgradeResEnough'){
        if(config_value.value == undefined){
            console.error(config_key, config_value, 'config error: lost value')
            return false
        }
        let prices = get_building_prices(config_option.name, planet.name)
        for (var i in config_value.value){
            if (!is_specific_resource_enough(prices, config_value.value[i])){
                return false
            }
        }

        return true
    }

    return true
}

function is_match_program_config(config_key, config_value, is_log=false){
    if (!has_page("Space")){
        if (config_key.includes('Program'))return false
        return true
    }
    let config_option = split_program_and_type(config_key)
    //非设定的 building_name + type，都认为是匹配的
    if (!config_option)return true
    let program = this.game.space.getProgram(config_option.name)

    if (config_option.type == 'ProgramUnlocked'){
        if (is_log) console.log(program, config_key, program.unlocked, config_value)
        if (program.unlocked == config_value){
            return true
        }else{
            return false
        }
    }

    if (config_option.type == 'ProgramValGe'){
        if (is_log) console.log(program, config_key, program.val, config_value)
        if (program.val >= config_value){
            return true
        }else{
            return false
        }
    }
    return true
}

function is_match_obj_config(config_key, config_value, is_log=false){
    if (!is_match_res_config(config_key, config_value, is_log)){
        if (is_log) console.log('res:', config_key, config_value)
        return false
    }

    if (!is_match_program_config(config_key, config_value, is_log)){
        if (is_log) console.log('program:', config_key, config_value)
        return false
    }

    if (!is_match_earth_bld_config(config_key, config_value, is_log)){
        if (is_log) console.log('earth:', config_key, config_value)
        return false
    }

    if (!is_match_space_bld_config(config_key, config_value, is_log)){
        if (is_log) console.log('space:', config_key, config_value)
        return false
    }

    return true
}

function is_match_res_config(config_key, config_value, is_log=false){
    let config_option = split_resource_and_type(config_key)
    //非设定的 res_name + type，都认为是匹配的
    if (!config_option)return true

    if (config_option.type == 'MinValue'){
        let _config_value = config_value
        if (typeof(config_value) == 'string' && config_value.startsWith('max/')){
            _config_value = 1 / parseFloat(config_value.slice(4)) * get_resource_maxvalue(config_option.name)
        }
        if (is_log) console.log(config_option, get_resource_value(config_option.name), _config_value)
        if (get_resource_value(config_option.name) >= _config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'MaxValueGe'){
        if (get_resource_maxvalue(config_option.name) >= config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'MaxValueLe'){
        if (is_log) console.log(config_option.name, get_resource_maxvalue(config_option.name), config_value, get_resource_maxvalue(config_option.name) <= config_value)
        if (get_resource_maxvalue(config_option.name) <= config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'ValueLe'){
        if (get_resource_value(config_option.name) <= config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'ValueGe'){
        if (get_resource_value(config_option.name) >= config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'MinRatio'){
        if (get_resource_ratio(config_option.name) >= config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'AvgRatioLe'){
        let value = config_value.value
        if (value == undefined){
            console.error(config_key, config_value + ', config error, lost value')
            return false
        }
        let count = 30
        if (config_value.count){
            count = config_value.count
        }
        if (is_log) console.log(config_option.name, config_value, get_res_average_ratio(config_option.name, count), value)
        if (get_res_average_ratio(config_option.name, count) <= value){
            return true
        } else {
            return false
        }
    }


    if (config_option.type == 'AvgRatioGe'){
        let value = config_value.value
        if (value == undefined){
            console.error(config_key, config_value + ', config error, lost value')
            return false
        }
        let count = 30
        if (config_value.count){
            count = config_value.count
        }
        if (get_res_average_ratio(config_option.name, count) >= value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'AvgValueLe'){
        let value = config_value.value
        if (value == undefined){
            console.error(config_key, config_value + ', config error, lost value')
            return false
        }
        let count = 30
        if (config_value.count){
            count = config_value.count
        }
        if (is_log) console.log(config_option.name, config_value, get_res_average_value(config_option.name, count), value)
        if (get_res_average_value(config_option.name, count) <= value){
            return true
        } else {
            return false
        }
    }


    if (config_option.type == 'AvgValueGe'){
        let value = config_value.value
        if (value == undefined){
            console.error(config_key, config_value + 'config error, lost value')
            return false
        }
        let count = 30
        if (config_value.count){
            count = config_value.count
        }
        if (get_res_average_value(config_option.name, count) >= value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'RatioGe'){
        if (get_resource_ratio(config_option.name) >= config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'RatioLe'){
        if (get_resource_ratio(config_option.name) <= config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'CanTrade'){
        let race = get_best_race_by_resource(config_option.name, false)
        if (is_log) console.log(config_option, race, config_value)
        if (config_value){
            if (race){
                return true
            } else {
                return false
            }
        }else{
            if (race){
                return false
            } else {
                return true
            }
        }
    }

    if (config_option.type == 'CanCraft'){
        if (is_log) console.log(config_option, can_craft(config_option.name), config_value)
        if (can_craft(config_option.name) == config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'TradeValueLe'){
        if (is_log) console.log(config_option, get_max_from_trade_by_resource(config_option.name), config_value)
        if (get_max_from_trade_by_resource(config_option.name) <= config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'TradeValueGe'){
        if (get_max_from_trade_by_resource(config_option.name) >= config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'IsShortRes'){
        if (is_log) console.log(config_option, is_resource_short_for_upgrade(config_option.name), config_value)
        if (is_resource_short_for_upgrade(config_option.name) == config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'IsBaseShortRes'){
        if (is_base_resource_short_for_upgrade(config_option.name) == config_value){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'IsWillFull'){
        let value = config_value.value
        if (value == undefined){
            value = 0.95
        }

        if (is_resource_will_full(config_option.name, value)){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'IsWillEmpty'){
        let value = config_value.value
        if (value == undefined){
            value = 0.1
        }

        if (is_resource_will_empty(config_option.name, value)){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'IsNotWillFull'){
        let value = config_value.value
        if (value == undefined){
            value = 0.95
        }

        if (!is_resource_will_full(config_option.name, value)){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'IsNotWillEmpty'){
        let value = config_value.value
        if (value == undefined){
            value = 0.1
        }

        if (!is_resource_will_empty(config_option.name, value)){
            return true
        } else {
            return false
        }
    }


    if (config_option.type == 'IsAvgWillFull'){
        let value = config_value.value
        if (value == undefined){
            value = 0.95
        }

        if (is_avg_resource_will_full(config_option.name, value)){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'IsAvgNotWillFull'){
        let value = config_value.value
        if (value == undefined){
            value = 0.95
        }

        if (!is_avg_resource_will_full(config_option.name, value)){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'IsAvgWillEmpty'){
        let value = config_value.value
        if (value == undefined){
            value = 0.1
        }

        if (is_avg_resource_will_empty(config_option.name, value)){
            return true
        } else {
            return false
        }
    }

    if (config_option.type == 'IsAvgNotWillEmpty'){
        let value = config_value.value
        if (value == undefined){
            value = 0.95
        }

        if (!is_avg_resource_will_empty(config_option.name, value)){
            return true
        } else {
            return false
        }
    }

    return true
}

function split_resource_and_type(config_key){
    let res_dataset = get_res_dataset()
    for(var i in res_dataset) {
        var res_data = res_dataset[i]
        if (config_key.startsWith(res_data.name)){
            return {name: res_data.name, type: config_key.slice(res_data.name.length)}
        }
    }
    if (config_key.startsWith('energy')){
            return {name: 'energy', type: config_key.slice('energy'.length)}
        }
    return null
}

function is_other_factor_effect_when_upgrade(bld_name, planet='earth', is_log=false){
    let buildings_data_options = auto_options.building.upgrade
    for(var bld_name_key in buildings_data_options){
        let bld_upgrade_option = buildings_data_options[bld_name_key]
        var condition = bld_upgrade_option.condition
        if (condition == undefined)continue
        let building = get_building(bld_name_key, bld_upgrade_option.planet)
        if (building.unlocked && condition['val' + building.val] != undefined){
            //检查其他配置限制资源不能开销
            let srcBuildingNoUpgrade_option = condition['val' + building.val].srcBuildingNoUpgrade
            if (is_log) console.log('check_srcBuildingNoUpgrade1:', bld_name, bld_name_key, condition,
                srcBuildingNoUpgrade_option, check_srcBuildingNoUpgrade(bld_name, planet, srcBuildingNoUpgrade_option))
            if (!check_srcBuildingNoUpgrade(bld_name, planet, srcBuildingNoUpgrade_option, is_log)) {
                return true
            }
        }
    }

    if (has_priority_resource()){
        //检查其他配置限制资源不能开销
        let short_res = short_resource()
        let bld_upgrade_option = buildings_data_options[short_res.name]
        if (bld_upgrade_option && bld_upgrade_option.condition && bld_upgrade_option.condition['priority']) {
            var condition = bld_upgrade_option.condition
            let srcBuildingNoUpgrade_option = condition['priority'].srcBuildingNoUpgrade
            if (short_res.name != bld_name || short_res.planet != planet) {
                if (is_log) console.log('check_srcBuildingNoUpgrade2:', bld_name, srcBuildingNoUpgrade_option, check_srcBuildingNoUpgrade(bld_name, planet, srcBuildingNoUpgrade_option))
                if (!check_srcBuildingNoUpgrade(bld_name, planet, srcBuildingNoUpgrade_option)) {
                    return true
                }
            }
        }
    }
    return false
}

function check_srcBuildingNoUpgrade(bld_name, planet, srcBuildingNoUpgrade_option, is_log=false){
    //检查其他配置限制资源不能开销
    if (srcBuildingNoUpgrade_option == undefined) return true

    if (is_log)console.log(bld_name, planet, srcBuildingNoUpgrade_option)
    for (var j in srcBuildingNoUpgrade_option){
        if (is_building_upgrade_need_resource(bld_name, srcBuildingNoUpgrade_option[j], planet)){
            if (is_log)console.log('can not upgrade：' + bld_name, planet,
                'options: ' , srcBuildingNoUpgrade_option)
            return false
        }
    }

    return true
}

function is_building_upgrade_need_resource(bld_name, resource, planet='earth'){
    let prices = get_building_prices(bld_name, planet)
    for(var i in prices){
        let price = prices[i]
        if (price.name == resource)return true
    }
    return false
}

function is_promote_resource_of_building(bld_name, resource, planet='earth'){
    //有些资源可能存在一边增加一边减少的情况
    //比如calciner，ironPerTickCon与ironPerTickAutoprod同时存在
    //{
    //     "mineralsPerTickCon": -1.5,
    //     "coalPerTickCon": -0.0889596450665107,
    //     "ironPerTickCon": -0.0889596450665107,
    //     "ironPerTickAutoprod": 0.2925,
    //     "titaniumPerTickAutoprod": 0.0019249999999999998,
    //     "oilPerTickCon": -0.024,
    //     "steelPerTickProd": 0.000889596450665107,
    //     "energyConsumption": 1,
    //     "cathPollutionPerTickProd": 1
    // }
    let effects = get_building_effects(bld_name, planet)
    let value = 0
    for (var key in effects){
        if (key.startsWith(resource)){
            value += effects[key]
        }
    }
    return value > 0
}

function is_con_resource_of_building(bld_name, resource, planet='earth'){
    //有些资源可能存在一边增加一边减少的情况
    //比如calciner，ironPerTickCon与ironPerTickAutoprod同时存在
    //{
    //     "mineralsPerTickCon": -1.5,
    //     "coalPerTickCon": -0.0889596450665107,
    //     "ironPerTickCon": -0.0889596450665107,
    //     "ironPerTickAutoprod": 0.2925,
    //     "titaniumPerTickAutoprod": 0.0019249999999999998,
    //     "oilPerTickCon": -0.024,
    //     "steelPerTickProd": 0.000889596450665107,
    //     "energyConsumption": 1,
    //     "cathPollutionPerTickProd": 1
    // }
    let effects = get_building_effects(bld_name, planet)
    let value = 0
    for (var key in effects){
        if (key.startsWith(resource)){
            value += effects[key]
        }
    }
    return value < 0
}

function get_building_promote_resources(bld_name, planet='earth'){
    let effects = get_building_effects(bld_name, planet)
    let res_dataset = get_res_dataset()
    let result = []
    res_dataset.forEach((res_data)=>{
        if (effects[res_data.name+'Ratio'] && effects[res_data.name+'Ratio'] > 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'RatioGlobal'] && effects[res_data.name+'RatioGlobal'] > 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'PerTick'] && effects[res_data.name+'PerTick'] > 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'PerTickBase'] && effects[res_data.name+'PerTickBase'] > 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'PerTickAutoprod'] && effects[res_data.name+'PerTickAutoprod'] > 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'PerTickProd'] && effects[res_data.name+'PerTickProd'] > 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'PerTickBaseSpace'] && effects[res_data.name+'PerTickBaseSpace'] > 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'PerTickAutoprodSpace'] && effects[res_data.name+'PerTickAutoprodSpace'] > 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'PerTickSpace'] && effects[res_data.name+'PerTickSpace'] > 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'Production'] && effects[res_data.name+'Production'] > 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'PerDay'] && effects[res_data.name+'PerDay'] > 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'ReductionRatio'] && effects[res_data.name+'ReductionRatio'] > 0){
            result.push(res_data.name)
            return
        }
    })
    if (effects['energyProduction'] && effects['energyProduction'] > 0){
        result.push('energy')
    }
    return result
}

function get_building_con_resources(bld_name, planet='earth'){
    let effects = get_building_effects(bld_name, planet)
    let res_dataset = get_res_dataset()
    let result = []
    res_dataset.forEach((res_data)=>{
        if (effects[res_data.name+'PerTick'] && effects[res_data.name+'PerTick'] < 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'RatioGlobal'] && effects[res_data.name+'RatioGlobal'] < 0){
            result.push(res_data.name)
            return
        }

        if (effects[res_data.name+'PerTickCon'] && effects[res_data.name+'PerTickCon'] < 0){
            result.push(res_data.name)
            return
        }
        if (effects[res_data.name+'ReductionRatio'] && effects[res_data.name+'ReductionRatio'] < 0){
            result.push(res_data.name)
            return
        }
        if (effects[res_data.name+'Consumption'] && effects[res_data.name+'Consumption'] > 0){
            result.push(res_data.name)
            return
        }
        if (effects[res_data.name+'PerDay'] && effects[res_data.name+'PerDay'] < 0){
            result.push(res_data.name)
            return
        }
    })

    if (effects['energyConsumption'] && effects['energyConsumption'] > 0){
        result.push('energy')
    }
    return result
}

function is_building_promote_resource(bld_name, resource, planet='earth'){
    //是否促进资源增进
    return is_building_bonus_resource(bld_name, resource, planet)
        || is_building_produce_resource(bld_name, resource, planet)
}

function is_building_bonus_resource(bld_name, resource, planet='earth') {
    //增益资源
    let effects = get_building_effects(bld_name, planet)
    let base_effect = (effects[resource + 'Ratio'] != undefined
                        && effects[resource + 'Ratio'] > 0)
                        || (effects[resource + 'Bonus'] != undefined
                        && effects[resource + 'Bonus'] > 0)
                        || (effects[resource + 'RatioGlobal'] != undefined
                        && effects[resource + 'RatioGlobal'] > 0)
    if (effects['observatoryRatio']){
        return base_effect || is_building_bonus_resource('observatory', resource, 'earth')
    }

    return base_effect
}

function is_building_produce_resource(bld_name, resource, planet='earth'){
    //生产资源
    let effects = get_building_effects(bld_name, planet)
    let base_effect = (effects[resource + 'PerTickAutoprod'] != undefined
        && effects[resource + 'PerTickAutoprod'] > 0)
        || (effects[resource + 'PerTickBase'] != undefined
        && effects[resource + 'PerTickBase'] > 0)
        || (effects[resource + 'PerTick'] != undefined
        && effects[resource + 'PerTick'] > 0)
        || (effects[resource + 'PerTickProd'] != undefined
        && effects[resource + 'PerTickProd'] > 0)
        || (effects[resource + 'PerTickBaseSpace'] != undefined
        && effects[resource + 'PerTickBaseSpace'] > 0)
        || (effects[resource + 'PerTickSpace'] != undefined
        && effects[resource + 'PerTickSpace'] > 0)
        || (effects[resource + 'PerTickAutoprodSpace'] != undefined
        && effects[resource + 'PerTickAutoprodSpace'] > 0)
        || (effects[resource + 'Production'] != undefined
        && effects[resource + 'Production'] > 0)
        || (effects[resource + 'PerDay'] != undefined
        && effects[resource + 'PerDay'] > 0)
        || (effects[resource + 'ReductionRatio'] != undefined
        && effects[resource + 'ReductionRatio'] > 0)

    if (effects['observatoryRatio']){
        return base_effect || is_building_bonus_resource('observatory', resource, 'earth')
    }

    return base_effect
}

function get_buildings_which_promote_res(resource){
    let unlocked_buildings = get_unlocked_buildings()
    let result = []
    unlocked_buildings.forEach((bld_data)=>{
        if (is_building_promote_resource(bld_data.name, resource, bld_data.planet)){
            result.push(bld_data)
        }
    })
    return result
}

function is_building_con_resource(bld_name, resource, planet='earth'){
    //消耗资源
    let effects = get_building_effects(bld_name, planet)
    let base_effect =  effects[resource + 'PerTickCon'] != undefined
        && effects[resource + 'PerTickCon'] < 0
        || effects[resource + 'ReductionRatio'] != undefined
        && effects[resource + 'ReductionRatio'] < 0
        || (effects[resource + 'PerDay'] != undefined
        && effects[resource + 'PerDay'] < 0)
        || (effects[resource + 'Consumption'] != undefined
        && effects[resource + 'Consumption'] > 0)
        || (effects[resource + 'PerTick'] != undefined
        && effects[resource + 'PerTick'] < 0)
        || (effects[resource + 'RatioGlobal'] != undefined
            && effects[resource + 'RatioGlobal'] < 0)

    if (effects['observatoryRatio']){
        return base_effect || is_building_bonus_resource('observatory', resource, 'earth')
    }

    return base_effect
}

function is_building_extend_storage(bld_name, resource, planet='earth'){
    //消耗资源
    let effects = get_building_effects(bld_name, planet)
    return effects[resource + 'Max'] != undefined
        && effects[resource + 'Max'] > 0
}

function get_bld_limited_resources(bld_name, planet='earth'){
    //获取建筑被哪些资源的容量限制
    if (!is_build_resource_limited(bld_name, planet))return []
    let prices = get_building_prices(bld_name, planet)
    let result = []
    prices.forEach((price)=>{
        if (get_resource_maxvalue(price.name) < price.val){result.push(price.name)}
    })
    return result
}

function get_building_extend_storage_res(bld_name, planet='earth'){
    //获取可扩展的存储的资源
    let effects = get_building_effects(bld_name, planet)
    let result = []
    for(var effect_key in effects){
        if (effects[effect_key] <= 0)continue
        if (effect_key.endsWith('Max')){
            result.push(effect_key.slice(0, -3))
        }
    }
    return result
}

function is_building_decr_unhappiness(bld_name, planet='earth'){
    //消耗资源
    let effects = get_building_effects(bld_name, planet)
    return effects['unhappinessRatio'] != undefined
        && effects['unhappinessRatio'] < 0
}

function is_building_incr_unhappiness(bld_name, planet='earth'){
    //消耗资源
    let effects = get_building_effects(bld_name, planet)
    return effects['happiness'] != undefined
        && effects['happiness'] < 0
}

function upgrade_buildings_which_promote_res(resource){
    let buildings_dataset = get_bonfire_building_dataset()
    let base_resources = get_craft_depends_auto_produce(resource)
    buildings_dataset.forEach((bld)=>{
        base_resources.forEach((base_res)=>{
            if (is_building_promote_resource(bld.name, base_res, 'earth')){
                upgrade_building_if_need(bld.name, 1, 'earth')
            }
        })
    })

    let planet_dataset = get_space_planet_dataset()
    planet_dataset.forEach((planet_data)=>{
        planet_data.buildings.forEach((bld_data)=>{
            base_resources.forEach((base_res)=> {
                if (is_building_promote_resource(bld_data.name, base_res, planet_data.name)) {
                    upgrade_building_if_need(bld_data.name, 1, planet_data.name)
                }
            })
        })
    })
}

function upgrade_buildings_which_extends_storage(resource){
    let buildings_dataset = get_bonfire_building_dataset()
    buildings_dataset.forEach((bld)=>{
        if (is_building_extend_storage(bld.name, resource, 'earth')){
            upgrade_building_if_need(bld.name, 1, 'earth')
        }
    })

    let planet_dataset = get_space_planet_dataset()
    planet_dataset.forEach((planet_data)=>{
        planet_data.buildings.forEach((bld_data)=>{
            if (is_building_extend_storage(bld_data.name, resource, planet_data.name)){
            upgrade_building_if_need(bld_data.name, 1, planet_data.name)
        }
        })
    })
}

function get_buildings_which_extends_storage(resource){
    let buildings_dataset = get_bonfire_building_dataset()
    let result = []
    buildings_dataset.forEach((bld)=>{
        if (is_building_extend_storage(bld.name, resource, 'earth')){
            result.push({name: bld.name, planet: 'earth'})
        }
    })

    let planet_dataset = get_space_planet_dataset()
    planet_dataset.forEach((planet_data)=>{
        planet_data.buildings.forEach((bld_data)=>{
            if (is_building_extend_storage(bld_data.name, resource, planet_data.name)){
                result.push({name: bld_data.name, planet: planet_data.name})
            }
        })
    })
    return result
}

try{
    if (game_data.length <= 0){
        game_data = {}
    }
}catch (e){
    game_data = {}
}

function get_res_average_ratio(res_name, max_count = 30){
    return _get_res_average_func(res_name, 'ratio', max_count)
}

function get_res_average_value(res_name, max_count = 30){
    return _get_res_average_func(res_name, 'value', max_count)
}

function _get_res_average_func(res_name, type, max_count = 30){
    let res_ratio_pool = game_data.resPool[res_name][type]
    let sum = 0
    let index = 0
    for (var i=res_ratio_pool.length-1; i>=0; i--){
        index += 1
        sum += res_ratio_pool[i]
        if (index > max_count){
            break
        }
    }
    if (index == 0)return 0
    return sum / index
}

function _add_game_res_data(res_name, key, value){
    let res_pool = game_data.resPool[res_name]
    if (res_pool[key] == undefined){
        res_pool[key] = []
    }

    let values = res_pool[key]
    values.push(value)
    if (values.length > 100){
        values.shift()
    }
}


function _record_game_res_data(res_name){
    if (game_data.resPool[res_name] == undefined){
        game_data.resPool[res_name] = {}
    }

    _add_game_res_data(res_name, 'ratio', get_resource_ratio(res_name))
    _add_game_res_data(res_name, 'value', get_resource_value(res_name))
}

function _record_game_event_data(event, data){
    if (game_data.eventPool[event] == undefined){
        game_data.eventPool[event] = []
    }

    //time: ms
    let eventPool = game_data.eventPool[event]
    if (eventPool.length <= 0){
        eventPool.push({data: data, time: new Date().valueOf(), interval: 0})
    }else{
        eventPool.push({data: data, time: new Date().valueOf(),
            interval: new Date().valueOf() - eventPool[eventPool.length-1].time})
    }

    if (eventPool.length > 100){
        eventPool.shift()
    }
}

function is_trade_frequently(max_count = 30){
    let event_pool = game_data.eventPool['trade']
    if (event_pool == undefined)return false
    let sum = 0
    let interval_sum = 0
    let index = 0
    for (var i=event_pool.length-1; i>=0; i--){
        index += 1
        if (event_pool[i].interval < 3000){sum += 1}
        interval_sum += event_pool[i].interval
        if (index > max_count){
            break
        }
    }
    if (index == 0)return false
    return sum / index > 3/4 && interval_sum / index < 5000
}

function _record_game_resources_data(){
    if (game_data.resPool == undefined){
        game_data.resPool = {}
    }
    if (game_data.eventPool == undefined){
        game_data.eventPool = {}
    }
    get_res_dataset().forEach((res_data)=>{
        _record_game_res_data(res_data.name)
    })
    _record_game_res_data('energy')
}

function record_game_data(){
    _record_game_resources_data()
}

try{clearInterval(game_starter_timer)}catch (e) {}
game_starter_timer = setInterval(()=>{
    this.game.bld.gatherCatnip()
    this.game.bld.refineCatnip()
    // this.game.tick()
}, 10)

function show_message(){
    if ($('.short-res').length <= 0){
        $($('#leftColumnViewport')[0]).before($("<div class='res-row short-res'></div>"))
    }

    let html = 'no priority resource'
    if (has_priority_resource()) {
        let short_res = short_resource()
        html = "<span>s:" + short_res.name + " (" + short_res.type + ")</span>"
        short_res.res.forEach((res_data)=>{
            let m = "<br><span>r:"+res_data.name+" (need:"+res_data.need_val+")</span>"
            html += m
        })
    }
    $($('.short-res')[0]).html(html)
}

function auto_up_building_stage(){
    let upgrade_options = auto_options.building.upgrade
    for(var bld_name in upgrade_options){
        let planet = upgrade_options[bld_name].plate
        let bld_option = upgrade_options[bld_name]
        if (bld_option.up_stage){
            handle_config_immediately(bld_name, bld_option.up_stage.immediately, 'upstage', planet)
        }
    }
}

function is_tick_match_cycle(cycle){
    return second_tick % cycle == 0
}

function get_config_trade_resource_option(res_name){
    let tradeRes_options = auto_options.trade.tradeRes
    for(var res_name_key in tradeRes_options){
        if (res_name_key != res_name){
            continue
        }

        let tradeRes_options_values = tradeRes_options[res_name_key]
        for(var i in tradeRes_options_values) {
            let tradeRes_options_value = tradeRes_options_values[i]
            let is_match = true
            for (var key in tradeRes_options_value) {
                if (!is_match_obj_config(key, tradeRes_options_value[key])) {
                    is_match = false
                    break
                }
            }
            if (is_match) return tradeRes_options_value
        }
    }
    return null
}

function is_prioritize_trade(resource){
    //是否以购买为主
    if (resource == 'titanium' || resource=='concrate' || resource=='kerosene')return true
    return false
}

function get_trade_amt_by_gold(){
    let gold_cost = get_trade_gold_cost()
    let base = Math.ceil(get_resource_ratio('gold')/gold_cost)
    if (is_resource_will_full('gold', 0.1) && is_resource_will_full('manpower', 0.1)){
        base = Math.ceil(get_resource_value('gold')/gold_cost)
    }
    let amt = base
    if (is_avg_resource_will_full('gold')){
        for (var i=10; i>1; i--) {
            if (base * i * gold_cost < get_res_average_value("gold") / 3) {
                amt = base * i
                break
            }
        }
    }

    return Math.max(1, amt)
}

function auto_trade() {
    if (!has_page('Trade'))return
    if (is_base_resource_short_for_upgrade('gold'))return

    let short_resources = short_resource()
    let is_traded = false
    short_resources.res.forEach((res_data)=>{
        let trade_option = get_config_trade_resource_option(res_data.name)
        if (!trade_option)return
        if (!is_resource_short_for_upgrade(res_data.name))return

        let target_res = res_data.name
        if (trade_option.srcRes){
            target_res = trade_option.srcRes
        }

        let race = get_best_race_by_resource(target_res)
        if (!race)return
        let buys_prices = race.buys
        buys_prices.forEach((buys_res)=>{
            if (buys_res.val > get_resource_value(buys_res.name)){
                if (can_craft(buys_res.name)){
                    craft(buys_res.name, buys_res.val - get_resource_value(buys_res.name))
                }
            }
        })

        trade(race.name, get_trade_amt_by_gold())
        is_traded = true
    })

    if (!is_traded){
        let timer_options = auto_options.trade.timer
        if (timer_options){
            if (is_tick_match_cycle(timer_options.cycle_unit_s)){
                let races = get_can_trade_races_if_buys_enough()
                let race = random_list(races)
                //console.log('timer trade: ' + race.name)
                if (race){
                    trade(race.name, get_trade_amt_by_gold())
                    is_traded = true
                }
            }
        }
    }

    if (is_resource_full('gold')){
        let gold_trade = false
        let short_res = short_resource()
        for (var i in short_res.res){
            let resource = short_res.res[i]
            if (can_craft(resource.name)){
                let race = get_best_race_by_resource(resource.name)
                if (race){
                    gold_trade = true
                    //向上取整
                    trade(race.name, get_trade_amt_by_gold())
                    break
                }
            }

            if (!gold_trade){
                let depend_resources = get_craft_depends_auto_produce_if_need(resource.name)
                //todo: 可能需要将depend_resources打乱顺序，随机获取，待观察
                for(var j in depend_resources){
                    let race = get_best_race_by_resource(depend_resources[j])
                    if (race){
                        gold_trade = true
                        //向上取整
                        trade(race.name, get_trade_amt_by_gold())
                        break
                    }
                }
            }

            if (!gold_trade){
                let races = get_can_trade_races_if_buys_enough()
                let race = random_list(races)
                //console.log('timer trade: ' + race.name)
                trade(race.name, get_trade_amt_by_gold())
                gold_trade = true
            }
        }
    }

    let races_options = auto_options.trade.races
    for (var race_name in races_options) {
        let race_option = races_options[race_name]
        if (race_option.immediately){
            handle_config_immediately(race_name, race_option.immediately, 'trade')
        }
    }
}

function get_trade_gold_cost(){
    return this.game.diplomacy.getGoldCost()
}

function get_value_from_prices(prices, src_name){
    for(var i in prices){
        if (prices[i].name == src_name){
            return prices[i].val
        }
    }
    return 0
}

function keep_min_kittens_num(job_name){
    //保留最少kittens数量
    if (get_current_year() < 3){
        if (job_name == 'woodcutter'){
            return 0
        }

        if (job_name == 'hunter'){
            return 0
        }

        return 1
    }

    if (get_current_year() < 10){
        if (job_name == 'woodcutter'){
            return 0
        }

        return 1
    }

    if (job_name == 'farmer') {
        if (get_resource_ratio('catnip') < 50) {
            return get_worker_kittens_num('farmer') + 1
        }
    }

    if (job_name == 'miner') {
        if (get_resource_ratio('minerals') <= 0){
            return get_worker_kittens_num('miner') + 1
        }

        if (get_current_year() > 100){
            return 5
        }
    }

    if (job_name == 'woodcutter') {
        if (get_resource_ratio('wood') <= 0){
            return get_worker_kittens_num('woodcutter') + 1
        }
    }

    if (job_name == 'hunter') {
        if (get_resource_ratio('manpower') <= 0){
            return get_worker_kittens_num('hunter') + 1
        }
    }

    if (job_name == 'science') {
        if (get_resource_ratio('science') <= 0){
            return get_worker_kittens_num('science') + 1
        }
    }

    if (job_name == "geologist"){
        if (get_resource_ratio('coal') <= 0){
            return get_worker_kittens_num('geologist') + 1
        }

        if (get_resource_ratio('gold') <= 0 && is_geologist_produce_gold()){
            return get_worker_kittens_num('geologist') + 1
        }
    }

    if (job_name == 'priest') {
        return 2
    }

    return 3
}

function monitor_kittens(){
    let options = auto_options.kittens

    if (!has_leader_kitten() && is_science_researched("civil")){
        let leader = this.game.village.sim.kittens[get_kittens_num() - 2]
        make_leader(leader)
    }
    promote_leader()

    let jobs = options.jobs
    for(var job_name in jobs){
        if (!has_job(job_name))continue
        let job_option = jobs[job_name]
        let default_value = job_option.default_value | 1

        let resources = job_option.resources
        for(var res_name in resources){
            let resource_option = resources[res_name]
            let effect = resource_option.effect
            if (effect == undefined){
                effect = true
            }
            if (res_name == 'gold'){
                effect = is_geologist_produce_gold()
                resource_option.effect = effect
            }
            if (!effect)continue
            if (resource_option.ratioNoLe){
                let ratioNoLe_value = resource_option.ratioNoLe
                let value = 0
                if (ratioNoLe_value.value){
                    value = ratioNoLe_value.value
                }
                if (get_resource_ratio(res_name) <= value && !is_resource_full(res_name)){
                    _smart_assgin_job(job_name, jobs_excludes)
                }
            }

            if (resource_option.avgRatioLe){
                let avgRatioLe_value = resource_option.avgRatioLe
                let value = 0
                if (avgRatioLe_value.value){
                    value = avgRatioLe_value.value
                }
                let count = 30
                if (avgRatioLe_value.count){
                    count = avgRatioLe_value.count
                }
                if (get_res_average_ratio(res_name, count) <= value && !is_resource_full(res_name)){
                    _smart_assgin_job(job_name, jobs_excludes)
                }
            }

            if (resource_option.valueNoLe){
                let valueNoLe_value = resource_option.valueNoLe
                let value = 0
                if (valueNoLe_value.value){
                    value = valueNoLe_value.value
                }
                if (get_resource_value(res_name) <= value) {
                    _smart_assgin_job(job_name, jobs_excludes)
                }
            }

            if (resource_option.avgValueLe){
                let avgValueLe_value = resource_option.avgValueLe
                let value = 0
                if (avgValueLe_value.value){
                    value = avgValueLe_value.value
                }
                let count = 30
                if (avgValueLe_value.count){
                    count = avgValueLe_value.count
                }
                if (get_res_average_value(res_name, count) <= value && !is_resource_full(res_name)){
                    _smart_assgin_job(job_name, jobs_excludes)
                }
            }

            if (resource_option.isShortRes){
                if (is_base_resource_short_for_upgrade(res_name) == resource_option.isShortRes) {
                    _smart_assgin_job(job_name, jobs_excludes)
                }
            }

            if (resource_option.reduceWhenFull){
                let reduceWhenFull_option = resource_option.reduceWhenFull
                let reduceWhenFull_value = reduceWhenFull_option.value
                if (reduceWhenFull_value == undefined){
                    reduceWhenFull_value = 0.95
                }
                if (is_resource_will_full(res_name, reduceWhenFull_value)){
                    unassign_job(job_name)
                    assign_job(_smart_find_target_job())
                }
            }

            if (resource_option.increaseWhenEmpty) {
                let increaseWhenEmpty_option = resource_option.increaseWhenEmpty
                let increaseWhenEmpty_option_value = increaseWhenEmpty_option.value
                if (increaseWhenEmpty_option_value == undefined){
                    increaseWhenEmpty_option_value = 0.1
                }
                if (is_resource_will_empty(res_name, increaseWhenEmpty_option_value)){
                    _smart_assgin_job(job_name, jobs_excludes)
                }
            }
        }

        if (get_worker_kittens_num(job_name) < default_value){
             _smart_assgin_job(job_name, jobs_excludes)
        }

        if (job_option.immediately){
            handle_config_immediately(job_name, job_option.immediately, 'job')
        }
    }

    if (!is_base_resource_short_for_upgrade('wood') && !is_base_resource_short_for_upgrade('minerals')){
        _smart_unassign_job()
        //保持wood与minerals ratio差不多
        if(get_resource_ratio('wood') / get_resource_ratio('minerals') > 1.1){
            reset_jobs('woodcutter', 'miner')
        }else if(get_resource_ratio('minerals') / get_resource_ratio('wood') > 1.1){
            reset_jobs('miner', 'woodcutter')
        }

        if(get_resource_value('beam') / get_resource_value('steel') > 10){
            if (get_worker_kittens_num('woodcutter') > 5){
                reset_jobs('woodcutter', 'geologist')
            }
        }
        if(get_resource_value('slab') / get_resource_value('steel') > 10){
            if (get_worker_kittens_num('miner') > 5) {
                reset_jobs('miner', 'geologist')
            }
        }
    }

    let free_index = 0
    while (has_free_kittens() && free_index < 10){
        free_index += 1
        assign_job(_smart_find_target_job())
    }

    // let last_excludes = []
    // if (is_trade_frequently()){
    //     if(get_res_average_ratio('manpower') <= 0
    //         || (is_avg_resource_will_full('gold', 0.95, 10)
    //             && is_avg_resource_will_empty('manpower', 0.1, 10)))
    //
    //     {
    //         last_excludes.push('hunter')
    //         _smart_assgin_job('hunter', ['hunter'])
    //     }
    //
    //     if(get_res_average_value('manpower') <= 100
    //         || (is_avg_resource_will_full('gold', 0.15, 10)
    //             && get_res_average_ratio('wood') > 10 * 1000))
    //
    //     {
    //         last_excludes.push('hunter')
    //         reset_jobs('woodcutter', 'hunter')
    //     }
    //
    //     if(get_res_average_value('gold') <= 100
    //         || (is_avg_resource_will_full('gold', 0.15, 10)
    //             && get_res_average_ratio('wood') > 10 * 1000))
    //
    //     {
    //         last_excludes.push('hunter')
    //         reset_jobs('woodcutter', 'hunter')
    //     }
    //
    //     if(is_geologist_produce_gold() && get_res_average_ratio('gold') <= 0
    //         || (is_avg_resource_will_full('manpower', 0.95, 10)
    //             && is_avg_resource_will_empty('gold', 0.1, 10)))
    //
    //     {
    //         last_excludes.push('geologist')
    //         _smart_assgin_job('geologist', ['geologist'])
    //     }
    // }

    if (get_resource_value('catnip') < 10000 && get_resource_ratio('catnip') < 100){
        //临时解决
        _smart_assgin_job('farmer', jobs_excludes.concat(['farmer']))
        _smart_assgin_job('farmer', jobs_excludes.concat(['farmer']))
        _smart_assgin_job('farmer', jobs_excludes.concat(['farmer']))
        if(get_resource_ratio('catnip') < 0) {
            _smart_assgin_job('farmer', jobs_excludes.concat(['farmer']))
            _smart_assgin_job('farmer', jobs_excludes.concat(['farmer']))
        }
    }
}

function _smart_unassign_job(){
    if (is_smelter_produce_resource_short_for_upgrade()){
        if (!has_job('geologist')){
            if (get_resource_ratio('catnip') <= 0){
                jobs_excludes.push('farmer')
            }
            let job_name = get_max_kitten_job(jobs_excludes.concat(['woodcutter', 'miner']))
            unassign_job(job_name)
        }
    }
}

function _smart_find_target_job(){
    let options = auto_options.kittens
    let jobs = options.jobs
    let target_jobs = []
    for(var job_name in jobs) {
        if (!has_job(job_name)) continue
        let job_option = jobs[job_name]
        let resources = job_option.resources
        for (var res_name in resources) {
            if (res_name == 'furs' || res_name == 'ivory')continue
            let effect = resources[res_name].effect
            if (effect != undefined && !effect)continue
            if (get_resource_ratio(res_name) <= 0){
                target_jobs.push(job_name)
            }
        }
    }

    if (is_base_resource_short_for_upgrade('iron')
        || is_base_resource_short_for_upgrade('coal')){
        target_jobs.push('woodcutter')
        target_jobs.push('miner')
    }

    if (target_jobs.length > 0){
        return target_jobs[Math.floor(Math.random() * target_jobs.length)]
    }

    let src_list = ['miner', 'woodcutter']
    return src_list[Math.floor(Math.random() * src_list.length)]
}

function _smart_assgin_job(job_name, excludes){
    if (!has_job(job_name))return

    if (job_name == 'geologist'){
        if (get_worker_kittens_num(job_name) > get_kittens_num()/2){
            return
        }
    }

    if (has_free_kittens()){
        assign_job(job_name)
    }else{
        let max_kitten_job = get_max_kitten_job(excludes.concat([job_name]))
        if (get_worker_kittens_num(job_name)/get_kittens_num() < 3/4){
            reset_jobs(max_kitten_job, job_name)
        }
    }
    if (get_worker_kittens_num(job_name)/get_kittens_num() < 4/5) {
        excludes.push(job_name)
    }
}

function get_jobs_by_resource(res_name){
    let base_res_names = get_craft_depends_auto_produce_if_need(res_name)
    let result = []
    base_res_names.forEach((base_res_name)=>{
        result = result.concat(_get_jobs_by_resource(base_res_name))
    })
    return Array.from(new Set(result))
}

function _get_jobs_by_resource(base_res_name){
    let result = []
    let options = auto_options.kittens
    let jobs = options.jobs
    for(var job_name in jobs){
        let resources = jobs[job_name].resources
        for(var job_res_name in resources){
            let resource_option = resources[job_res_name]
            let effect = resource_option.effect | true
            if (!effect)continue
            if (base_res_name == job_res_name){
                result.push(job_name)
            }
        }
    }
    return Array.from(new Set(result))
}

let jobs_excludes = []
function auto_assign_kittens(){
    jobs_excludes = []
    if (has_priority_resource()){
        let resource_dataset = get_res_dataset()
        resource_dataset.forEach((res_data)=>{
            if (is_base_resource_short_for_upgrade(res_data.name)){
                get_jobs_by_resource(res_data.name).forEach((job_name)=>{
                    _smart_assgin_job(job_name, jobs_excludes)
                })
            }
        })

        resource_dataset.forEach((res_data)=>{
            if (is_resource_short_for_upgrade(res_data.name)){
                get_jobs_by_resource(res_data.name).forEach((job_name)=>{
                    _smart_assgin_job(job_name, jobs_excludes)
                })
            }
        })
    }

    monitor_kittens()
}

function is_science_researched(name){
    return this.game.science.get(name).researched
}

function is_workshop_researched(name){
    return this.game.workshop.get(name).researched
}

function is_smelter_produce_resource_short_for_upgrade(){
    if (!has_bonfire_div('smelter') || get_bonfire_building('smelter').val <= 0)return
    return is_resource_short_for_upgrade('coal')
            || is_resource_short_for_upgrade('iron')
            || is_resource_short_for_upgrade('plate')
            || is_resource_short_for_upgrade('gold')
            || is_resource_short_for_upgrade('steel')
            || is_resource_short_for_upgrade('gear')
            || is_resource_short_for_upgrade('alloy')
}

function is_calciner_produce_resource_short_for_upgrade() {
    if (!has_bonfire_div('calciner') || get_bonfire_building('calciner').val <= 0) return
    return is_resource_short_for_upgrade('iron')
        || is_resource_short_for_upgrade('titanium')
}

function is_mint_produce_resource_short_for_upgrade(){
    if (!has_bonfire_div('mint') || get_bonfire_building('mint').val <= 0)return
    return is_resource_short_for_upgrade('furs')
            || is_resource_short_for_upgrade('ivory')
            || is_resource_short_for_upgrade('parchment')
            || is_resource_short_for_upgrade('manuscript')
            || is_resource_short_for_upgrade('compedium')
            || is_resource_short_for_upgrade('blueprint')
}

function auto_assgin_building_on(){
    let unlocked_buildings = get_unlocked_buildings()
    unlocked_buildings.forEach((bld_data)=> {
        let bld_name = bld_data.name
        let planet = bld_data.planet
        let bld_options = auto_options.building.upgrade[bld_name]
        if (bld_options && bld_options.on_off) {
            let bld_off_options = bld_options.on_off
            let is_off = false
            let to_value = undefined
            let interval = undefined
            bld_off_options.forEach((off_option) => {
                if (is_off) return

                if (off_option.energyEmergency){
                    if (is_energy_emergency() != off_option.energyEmergency){
                        is_off = false
                        return
                    }
                }

                if (off_option.seasons){
                    let is_match_season = false
                    for(var i in off_option.seasons){
                        if (off_option.seasons[i].toLowerCase() == get_current_season().toLowerCase()){
                            is_match_season = true
                        }
                    }
                    if (!is_match_season){is_off = false; return}
                }

                let is_off_this_round = true
                for (var off_key in off_option) {
                    if (!is_match_obj_config(off_key, off_option[off_key])) {
                        is_off_this_round = false
                        break
                    }
                }

                if (is_off_this_round){
                    is_off = true
                    to_value = off_option.toValue
                    interval = off_option.interval
                    return
                }
            })

            if (is_off) {
                let bld = get_building(bld_name, planet)
                if (to_value){
                    if (to_value >= 0 && to_value <= bld.val) bld.on = to_value
                }else if (interval){
                    if (bld.on + interval > bld.val) {bld.on = bld.val}
                    else if (bld.on + interval < 0) {bld.on = 0}
                    else {bld.on += interval}
                }

                return
            }
        }


        let building_promote_res = get_building_promote_resources(bld_name, planet)
        let building_con_res = get_building_con_resources(bld_name, planet)
        if (building_promote_res.length == 0 && building_con_res.length)return

        //if (bld_name == 'accelerator')console.log(building_promote_res, building_con_res)

        let on_count = 1
        building_promote_res.forEach((promote_res)=>{
            //if (bld_name == 'accelerator')console.log(planet, promote_res, is_promote_resource_of_building(bld_name, promote_res, planet))
            if (!is_promote_resource_of_building(bld_name, promote_res, planet))return
            if (is_base_resource_short_for_upgrade(promote_res)){
                on_count += 1
                if (is_resource_will_empty(promote_res)){
                    on_count += 1
                }
            }

            if (is_resource_full(promote_res)){
                on_count -= 1
            }
        })

        building_con_res.forEach((con_res)=>{
            // if (bld_name == 'accelerator')console.log(planet, con_res, is_con_resource_of_building(bld_name, con_res, planet))
            if (!is_con_resource_of_building(bld_name, con_res, planet))return
            if (is_base_resource_short_for_upgrade(con_res)){
                on_count -= 1
                if (is_resource_full(con_res)){
                    on_count += 1
                }else if (is_resource_will_empty(con_res)){
                    on_count -= 1
                }

                if (is_resource_will_empty(con_res, 0.05)){
                    on_count -= 2
                }
            }

            if (get_resource_ratio(con_res) <= 0){
                on_count -= 2
            }
            if (is_resource_empty(con_res, 0.05)){
                on_count -= 2
            }
            if (con_res == 'energy' && is_energy_emergency()){
                if (get_building('sunlifter', 'helios').val > 0){
                    on_count -= 2
                }
            }
        })

        // if (bld_name == 'accelerator')console.log(on_count)
        if (on_count > 0){
            incr_building_on(bld_name, 1, planet)
        }else if (on_count < 0){
            decr_building_on(bld_name, 1, planet)
        }
    })
}

function monitor_upgrade_building(){
    if (!is_over_population()){
        //是否优先升级人口，可换成upgrade_building_group
        upgrade_building_group_if_need('population')
    }

    if (get_resource_ratio('catnip') <= 0){
        upgrade_buildings_which_promote_res('catnip')
    }

    let building_upgrade_option = auto_options.building.upgrade
    for(var bld_name in building_upgrade_option){
        let bld_upgrade_option = building_upgrade_option[bld_name]
        let planet = bld_upgrade_option.planet

        let bld_obj = get_building(bld_name, planet)
        if (bld_upgrade_option['val' + bld_obj.val]){
            let bld_upgrade_option_valX = bld_upgrade_option['val' + bld_obj.val]
            handle_config_immediately(bld_name, bld_upgrade_option_valX.immediately, 'building', planet)
        }

        if (bld_upgrade_option['valX']){
            let bld_upgrade_option_valX = bld_upgrade_option['valX']
            handle_config_immediately(bld_name, bld_upgrade_option_valX.immediately, 'building', planet)
        }
    }
}

function check_config_noShortRes(noShortRes_option){
    if (noShortRes_option == undefined){
        return true
    }

    let short_src_value = noShortRes_option
    for(var i in short_src_value){
        let src_name = short_src_value[i]
        let base_short_src = get_craft_depends_auto_produce(src_name)
        for(var j in base_short_src){
            if (is_base_resource_short_for_upgrade(base_short_src[j])){
                return false
            }
        }
    }
    return true
}

function handle_config_immediately(name, immediately_options, _short_resource_type, planet='earth', is_log=false){
    if (immediately_options == undefined)return

    immediately_options.forEach((immediately_option)=>{
        if (is_log)console.log('check:', name, immediately_option, check_config_immediately(name, immediately_option))
        if (check_config_immediately(name, immediately_option, is_log)){
            let prices = undefined
            if (_short_resource_type == 'building'){
                upgrade_building_if_need(name, 1, planet)
                prices = get_building_prices(name, planet)
            }else if(_short_resource_type == 'craft'){
                craft_for_short_resource(name)
                prices = get_craft_prices(name)
            }else if(_short_resource_type == 'upstage'){
                safe_up_building_stage(name, planet)
                return
            }else if(_short_resource_type == 'trade'){
                trade(name, get_trade_amt_by_gold())
                return
            }else if (_short_resource_type == 'job'){
                if (immediately_option.assign == false){
                    unassign_job(name)
                }else{
                    if (immediately_option.fromJob){
                        reset_jobs(immediately_option.fromJob, name)
                    }else{
                        jobs_excludes.push(name)
                        _smart_assgin_job(name, jobs_excludes)
                    }
                }

                return
            }else{
                console.error(_short_resource_type, 'error')
                return
            }

            if (immediately_option.incr_priority){
                if (!has_priority_resource()){
                    if(!_is_resource_limited(prices) && incr_shorted_resource_priority(name, _short_resource_type)) {
                        console.log('incr_priority ' + _short_resource_type + ': ' + name)
                    }
                }
            }

            if (immediately_option.force_incr_priority){
                if(!_is_resource_limited(prices) && incr_shorted_resource_priority(name, _short_resource_type)){
                    console.log('force_incr_priority ' + _short_resource_type + ': ' + name)
                    console.log("immediately check pass: " , immediately_option)
                }else{
                    if (_is_resource_limited(prices) && _short_resource_type == 'building'){
                        let need_resources = get_bld_limited_resources(name, planet)
                        need_resources.forEach((_res_name)=>{
                            upgrade_buildings_which_extends_storage(_res_name)
                        })
                    }
                }
            }
        }
    })
}

function check_config_immediately(bld_name, immediately_option, is_log=false){
    if (!check_config_noShortRes(immediately_option.noShortRes)){
        return false
    }

    if (immediately_option.isGeologistProduceGold != undefined){
        if (is_geologist_produce_gold() != immediately_option.isGeologistProduceGold){
            return false
        }
    }

    if (immediately_option.tech){
        if (!is_match_tech_config(immediately_option.tech)){
            return false
        }
    }

    if (immediately_option.upgrades){
        if (!is_match_upgrades_config(immediately_option.upgrades)){
            return false
        }
    }

    if (immediately_option.tradeFrequently){
        let tradeFrequently_option = immediately_option.tradeFrequently
        if (tradeFrequently_option.value == undefined){
            console.error(immediately_option.tradeFrequently, "config error, lost value")
            return false
        }
        let count = 30
        if (tradeFrequently_option.count){
            count = tradeFrequently_option.count
        }
        if (is_trade_frequently(count) != tradeFrequently_option.value){
            return false
        }
    }

    if (immediately_option.happinessLs){
        if (get_happiness() >= immediately_option.happinessLs){
            return false
        }
    }

    if (immediately_option.energyEmergency){
        if (is_energy_emergency() != immediately_option.energyEmergency){
            return false
        }
    }

    if (immediately_option.seasons){
        let is_match_season = false
        for(var i in immediately_option.seasons){
            if (immediately_option.seasons[i].toLowerCase() == get_current_season().toLowerCase()){
                is_match_season = true
            }
        }
        if (!is_match_season)return false
    }

    if (immediately_option.limitedBldPercentage){
        let limitedBldPercentage_value = immediately_option.limitedBldPercentage
        let unlocked_limited_buildings = get_unlocked_limited_building()
        let target_buildings = get_bld_can_extends_limited_buildings(bld_name)
        if (target_buildings.length / unlocked_limited_buildings.length < limitedBldPercentage_value){
            return false
        }
    }

    if (immediately_option.allRacesLimitedCulture){
        if (is_log)console.log('allRacesLimitedCulture', bld_name, immediately_option)
        let allRacesLimitedCulture_value = immediately_option.allRacesLimitedCulture
        if (is_all_races_can_not_upgrade() != allRacesLimitedCulture_value){
            return false
        }
    }

    for (var key in immediately_option){
        if (is_log)console.log('is_match_obj_config:', key, immediately_option[key], is_match_obj_config(key, immediately_option[key]))
        if (!is_match_obj_config(key, immediately_option[key], is_log)){
            return false
        }
    }

    return true
}

function get_unlocked_buildings(){
    let bonfire_building_dataset = get_bonfire_building_dataset()
    let result = []
    bonfire_building_dataset.forEach((bld_data)=>{
        let bld_obj = get_bonfire_building(bld_data.name)
        if (!bld_obj.unlocked)return
        result.push({name: bld_data.name, planet: 'earth'})
    })

    let space_planet_dataset = get_space_planet_dataset()
    space_planet_dataset.forEach((planet_data)=>{
        planet_data.buildings.forEach((bld_data)=>{
            let bld_obj = get_space_building(bld_data.name)
            if (!bld_obj.unlocked)return
            result.push({name: bld_data.name, planet: planet_data.name})
        })
    })

    return result
}

function get_unlocked_limited_building(){
    let unlocked_buildings = get_unlocked_buildings()
    let result = []
    unlocked_buildings.forEach((bld_data)=>{
        if (!is_build_resource_limited(bld_data.name, bld_data.planet))return
        result.push(bld_data)
    })
    return result
}

function is_building_upgrade_limited_res(bld_name, res_name, planet='earth'){
    //是否建筑bld_name升级被资源res_name储存容量限制
    let prices = get_building_prices(bld_name, planet)
    for (var i in prices){
        if (prices[i].name == res_name){
            if (get_resource_maxvalue(res_name) < prices[i].val){
                return true
            }
        }
    }
    return false
}

function get_bld_can_extends_limited_buildings(bld_name, planet='earth'){
    //建筑bld_name能扩展资源容量，以支持哪些受限的建筑
    //比如mine升级需要wood，但wood容易不足以支撑升级，而bld_name=='warehouse'的建筑可以扩展wood的容易
    //返回所有warehouse影响的建筑，而这些建筑必须已经受限
    let unlocked_limited_buildings = get_unlocked_limited_building()
    let extend_resources = get_building_extend_storage_res(bld_name, planet)
    let result = []
    unlocked_limited_buildings.forEach((limited_bld_data)=>{
        extend_resources.forEach((res_name)=>{
            if(is_building_upgrade_limited_res(limited_bld_data.name, res_name, limited_bld_data.planet)){
                result.push(limited_bld_data)
            }
        })
    })
    return Array.from(new Set(result))
}

function auto_upgrade_building(){
    setTimeout(()=>{
        monitor_upgrade_building()
    }, 10)

    if (has_priority_resource()){
        let short_data = short_resource()
        short_data.res.forEach((res)=>{
            //先升级直接生成的building
            upgrade_buildings_which_promote_res(res.name)
            //间接生成的building, 比如beam，寻找生成wood的建筑升级
            get_craft_depends_auto_produce(res.name).forEach((res_name)=>{
                upgrade_buildings_which_promote_res(res.name)
            })
        })

        short_data.limites.forEach((res_name)=>{
            upgrade_buildings_which_extends_storage(res_name)
        })
        return
    }

    if (get_res_average_value('energy') < 0){
        upgrade_building_group_if_need('energy')
    }
}

const _build = (bld_name, val, planet='earth') => {
    let controller = undefined, model = undefined
    if (planet == 'earth') {
        controller = new classes.ui.btn.BuildingBtnModernController(this.game);
        model = controller.fetchModel({
            key: bld_name,
            building: bld_name
        });
    }else{
        controller = new classes.ui.space.PlanetBuildingBtnController(this.game);
        model = controller.fetchModel({
            id: bld_name,
        });
    }
    controller.build(model, val);
};

function sell_all_bonfire_building(bld_name, planet='earth'){
    let controller = undefined, model = undefined
    if (planet == 'earth') {
        controller = new classes.ui.btn.BuildingBtnModernController(this.game);
        model = controller.fetchModel({
            key: bld_name,
            building: bld_name
        });
    }else{
        controller = new classes.ui.space.PlanetBuildingBtnController(this.game);
        model = controller.fetchModel({
            id: bld_name,
        });
    }
    while (controller.hasSellLink(model) && get_building(bld_name, planet).val != 0){
        controller.sell(undefined, model)
    }
}

function is_building_can_up_stage(bld_name, planet='earth'){
    let building = get_building(bld_name, planet)
    if (building.stages == undefined)return false
    if (building.stage == 1)return false
    if (!building.stages[1].stageUnlocked)return false
    return true
}

function up_building_stage(bld_name, planet='earth'){
    let building = get_building(bld_name, planet)
    if (building.stages == undefined)return
    if (building.stage == 1)return
    if (!building.stages[1].stageUnlocked)return
    building.stage = 1
}

function safe_up_building_stage(bld_name, planet='earth'){
    if (!is_building_can_up_stage(bld_name, planet))return
    sell_all_bonfire_building(bld_name, planet)
    up_building_stage(bld_name, planet)
}

function is_build_has_enough_resource(bldname, planet='earth'){
    let prices = get_building_prices(bldname, planet)
    return is_resource_enough(prices)
}

function is_build_resource_limited(bldname, planet='earth'){
    let prices = get_building_prices(bldname, planet)
    return _is_resource_limited(prices)
}

function _is_resource_limited(prices){
    return this.game.resPool.isStorageLimited(prices)
}

function is_resource_enough(prices){
    return this.game.resPool.hasRes(prices, 1)
}

function is_specific_resource_enough(prices, resource){
    for(var i in prices){
        if (prices[i].name != resource){
            continue
        }

        if (get_resource_value(resource) < prices[i].val){
            return false
        }
    }
    return true
}

function get_resource_value(name){
    if (name == 'energy')return get_energy_value()
    return this.game.resPool.get(name).value
}

function get_resource_ratio(name){
    let res = this.game.resPool.get(name)
    if (res.calculatePerDay){
        return this.game.getResourcePerDay(res.name);
    }

    if (res.calculateOnYear){
        return this.game.getResourceOnYearProduction(res.name);
    }
    return this.game.getResourcePerTick(name, true) * this.game.getTicksPerSecondUI()
}

function is_resource_will_full(name, threshold=0.95){
    let res = this.game.resPool.get(name)
    if (res.maxValue == 0){
        return false
    }
    return res.value / res.maxValue >= threshold
}

function is_avg_resource_will_full(name, threshold=0.95, max_count=30){
    let res = this.game.resPool.get(name)
    if (res.maxValue == 0){
        return false
    }
    return get_res_average_value(name, max_count) / res.maxValue >= threshold
}

function is_resource_full(name){
    return is_resource_will_full(name,1)
}

function is_resource_will_empty(name, threshold=0.05){
    let res = this.game.resPool.get(name)
    if (res.maxValue == 0){
        return false
    }
    return res.value / res.maxValue <= threshold
}

function is_avg_resource_will_empty(name, threshold=0.95, max_count=30){
    let res = this.game.resPool.get(name)
    if (res.maxValue == 0){
        return false
    }
    return get_res_average_value(name, max_count) / res.maxValue <= threshold
}

function is_resource_empty(name){
    return is_resource_will_empty(name, 0)
}

function is_resource_craftable(name){
    return this.game.resPool.get(name).craftable != undefined && this.game.resPool.get(name).craftable
}

function is_resource_display(name){
    let res = this.game.resPool.get(name)
    return !res.isHidden && res.unlocked
}

function get_resource_maxvalue(name){
    let max_value = this.game.resPool.get(name).maxValue
    if (max_value != 0)return max_value
    if (this.game.resPool.get(name).craftable)return Number.MAX_SAFE_INTEGER
    return 0
}

function add_resource(name, value){
    this.game.resPool.addResEvent(name, value);
}

function pay(prices){
    return this.game.resPool.payPrices(prices)
}

function incr_building_on(bld_name, value=1, planet='earth'){
    let bld = get_building(bld_name, planet)
    if (!bld.togglable){
        bld.on = bld.val
        return
    }
    if (is_building_on_full(bld_name, planet))return
    if (bld.on + value > bld.val){
        bld.on = bld.val
    }else{
        bld.on = bld.on + value
    }
}

function incr_building_on_to_full(bld_name, planet='earth'){
    let bld = get_building(bld_name, planet)
    incr_building_on(bld_name, bld.val - bld.on, planet)
}

function decr_building_on(bld_name, value=1, planet='earth'){
    let bld = get_building(bld_name, planet)
    if (!bld.togglable)return
    if (is_building_on_empty(bld_name, planet))return
    if (bld.on - value > 0){
        bld.on = bld.on - value
    }else{
        //永远保留一个
        bld.on = 1
    }

}

function decr_building_on_to_empty(bld_name, planet='earth'){
    let bld = get_building(bld_name, planet)
    decr_building_on(bld_name, bld.on, planet)
}

function is_building_on_full(bld_name, planet='earth'){
    let bld = get_building(bld_name, planet)
    return bld.on >= bld.val
}

function is_building_on_empty(bld_name, planet='earth'){
    let bld = get_building(bld_name, planet)
    return bld.on <= 0
}

function get_bonfire_building(bld_name){
    return this.game.bld.get(bld_name)
}

function get_space_building(bld_name){
    return this.game.space.getBuilding(bld_name)
}

function get_space_planet_of_building(bld_name){
    for(var i in this.game.space.planets){
        let planet = this.game.space.planets[i]
        for (var j in planet.buildings){
            if (planet.buildings[j].name == bld_name){
                return planet
            }
        }
    }
    return null
}

function get_building(bld_name, planet='earth'){
    if (planet == 'earth'){
        return get_bonfire_building(bld_name)
    }
    return get_space_building(bld_name)
}

function get_bonfire_building_prices(bld_name){
    let controller = new classes.ui.btn.BuildingBtnModernController(this.game);
    let model = controller.fetchModel({
        key: bld_name,
        building: bld_name
    });

    return controller.getPrices(model)
}

function get_space_building_prices(bld_name){
    let controller = new classes.ui.space.PlanetBuildingBtnController(this.game);
    let model = controller.fetchModel({
        id: bld_name,
    });

    return controller.getPrices(model)
}

function get_building_prices(bld_name, planet='earth'){
    if (planet == 'earth'){
        return get_bonfire_building_prices(bld_name)
    }
    return get_space_building_prices(bld_name)
}

function get_building_effects(bld_name, planet='earth'){
    let building = get_building(bld_name, planet)
    if (typeof (building.stages) == "object"){
        var currentStage = building.stages[building.stage || 0];
        if (currentStage.effects) {
            if(currentStage.effectsCalculated){
                return currentStage.effectsCalculated
            }
            return currentStage.effects
        } else {
            if(building.effectsCalculated){
                return building.effectsCalculated
            }
            return building.effects
        }
    }

    if(building.effectsCalculated){
        return building.effectsCalculated
    }
    return building.effects
}

function has_bonfire_div(bld_name){
    if (!this.game.bld.getBuildingExt(bld_name)){
        return false
    }
    return this.game.bld.getBuildingExt(bld_name).meta.unlocked
}

function is_building_unlock(bld_name, planet='earth'){
    if (get_building(bld_name, planet) == undefined){
        return false
    }
    return get_building(bld_name, planet).unlocked
}

function _has_same_resource(prices1, prices2){
    for(var i in prices1){
        for(var j in prices2){
            if (prices1[i].name == prices2[j].name){
                return true
            }
        }
    }
    return false
}

function is_resource_satisfy(stay_prices, target_prices){
    //现有资源减去目标资源，是否还有足够资源满足价格stay_prices
    for(var i in stay_prices){
        for(var j in target_prices){
            if (stay_prices[i].name != target_prices[j].name){
                continue
            }
            if (get_resource_value(stay_prices[i].name) - target_prices[j].val < stay_prices[i].val){
                return false
            }
        }
    }
    return true
}

function upgrade_building_if_need(bldname, times=1, planet='earth'){
    //必要才升级
    if (!is_building_unlock(bldname, planet)){
        return
    }

    if (!is_building_match_upgrade_condition(bldname, planet))return
    if (!is_building_match_craft_condition(bldname, planet))return

    if (is_building_match_incr_priority_condition(bldname, planet) && !is_build_resource_limited(bldname, planet)){
        if (incr_shorted_resource_priority(bldname, 'building')){
            console.log('upgrade_building_if_need incr_priority: ' + bldname)
        }
    }

    let bld = get_building(bldname, planet)
    if (bld.val == bld.on){
        upgrade_building(bldname, times, planet)
    }else{
        //console.log('not need to upgrade building:' + bldname)
    }
}

function upgrade_building(bldname, times, planet='earth'){
    if (is_building_unlock(bldname, planet)){
        if (is_build_has_enough_resource(bldname, planet)){
            remove_short_resource('building', bldname)
            _build(bldname, times, planet)
            console.log('upgrade building(' + planet + '): ' + bldname)
        }else{
            let prices = get_building_prices(bldname, planet)
            if (_is_resource_limited(prices)){
                record_short_resource('building', bldname, prices, true, planet)
            }else{
                record_short_resource('building', bldname, prices, false, planet)
            }
        }
    }
}

function is_geologist_produce_gold(){
    if (!has_job('geologist'))return false
    return get_job('geologist').modifiers.gold != undefined
}

function get_job(name){
    return this.game.village.getJob(name)
}

function has_job(name){
    if (!has_page('Village')){
        return false
    }
    return get_job(name).unlocked
}

function assign_job(name, num=1){
    var job = get_job(name)
    this.game.village.assignJob(job, num)
    this.game.villageTab.updateTab();
}

function reset_jobs(from_name, to_name, num=1){
    if (!from_name || !to_name){
        return
    }
    unassign_job(from_name, num)
    assign_job(to_name, num)
}

function random_assign_job(jobs, num=1){
    let name = jobs[Math.floor(Math.random() * jobs.length)]
    if (name){
        assign_job(name, num)
    }
}

function get_max_kitten_job(excludes=[]){
    //excludes: list
    let jobs = this.game.village.jobs
    let job = null
    let max = 0
    for (var i = jobs.length - 1; i >= 0; i--) {
        let min_num = keep_min_kittens_num(jobs[i].name)
        if (min_num < jobs[i].value && jobs[i].value > max && excludes.indexOf(jobs[i].name) < 0){
            max = jobs[i].value
            job = jobs[i]
        }
    }

    if (job){
        return job.name
    }
    return null
}

function show_all_jobs(){
    return this.game.village.jobs
}

function unassign_job(name, num=1){
    for (var j=0;j<num;j++) {
        let leader_kitten = null
        let not_leader_kittens = []
        for (var i in this.game.village.sim.kittens) {
            var kitten = this.game.village.sim.kittens[i];
            if (name == kitten.job) {
                if (kitten.isLeader !=undefined && kitten.isLeader) {
                    leader_kitten = kitten
                } else {
                    not_leader_kittens.push(kitten)
                }
            }
        }

        if (not_leader_kittens.length > 0) {
            this.game.village.unassignJob(not_leader_kittens[0])
            this.game.villageTab.updateTab();
            continue
        }

        if (leader_kitten) {
            this.game.village.unassignJob(leader_kitten)
            this.game.villageTab.updateTab();
        }
    }
}

function promote_leader(){
    var leader = this.game.village.leader;
    if (!leader) return
    var expToPromote = this.game.village.getRankExp(leader.rank);
    var goldToPromote = 25 * (leader.rank + 1);
    var gold = this.game.resPool.get("gold");
    if (leader.exp < expToPromote || gold.value < goldToPromote)return
    this.game.village.sim.promote(leader);

    census = new classes.ui.village.Census(this.game);
    census.renderGovernment(census.container);
    census.update();
    console.log('promote leader')
}

function has_leader_kitten(){
    return this.game.village.leader != undefined && this.game.village.leader != null
}

function make_leader(kitten){
    if (kitten == undefined || kitten == null)return
    let census = new classes.ui.village.Census(this.game);
    census.makeLeader(kitten)
    console.log('make leader')
}

function has_page(name){
    for (var i in this.game.tabs){
        if (this.game.tabs[i].tabId == name){
            return this.game.tabs[i].visible
        }
    }
    return false
}

function get_over_population() {
    return this.game.village.getOverpopulation()
}

function is_over_population() {
    return this.game.village.getOverpopulation() > 0
}

function get_free_kittens_num(){
    return this.game.village.getFreeKittens()
}

function has_free_kittens(num=1){
    return this.game.village.hasFreeKittens(num)
}

function get_kittens_num(){
    return this.game.village.getKittens()
}

function get_worker_kittens_num(job_name){
    return this.game.village.getWorkerKittens(job_name)
}

function get_happiness(){
    //100%时为1，最小为0.25
    return this.game.village.happiness
}

function upgrade_all_science(){
    if (!has_page('Science')){
        return
    }
    var techs = this.game.science.techs
    for (var i=0; i<techs.length; i++){
        setTimeout(upgrade_science_func, i+1, i)
    }
}

function get_science_prices(tech_name){
    let controller = new com.nuclearunicorn.game.ui.TechButtonController(this.game)
    let model = controller.fetchModel({id: tech_name})
    return controller.getPrices(model)
}

function upgrade_science_func(index){
    let tech = gamePage.science.techs[index]

    if (tech.unlocked && !tech.researched) {
        let controller = new com.nuclearunicorn.game.ui.TechButtonController(this.game)
        let model = controller.fetchModel({id: tech.name})
        let prices = controller.getPrices(model)
        if (is_resource_enough(prices)){
            remove_short_resource('tech', tech.name)
            pay(prices)
            model.prices = controller.getPrices(model)

            tech.researched = true;
            tech.unlocked = true;
            this.game.unlock(tech.unlocks);
            console.log('science upgrade: ' + tech.name)
        } else {
            if (_is_resource_limited(prices)){
                record_short_resource('tech', tech.name, prices, true)
            }else{
                record_short_resource('tech', tech.name, prices, false)
            }
        }
    }
}

function upgrade_all_workshop(){
    if (!has_page('Workshop')){
        return
    }
    var upgrades = this.game.workshop.upgrades
    for (var i=0; i<upgrades.length; i++){
        setTimeout(upgrade_workshop_func, i+1, i)
    }
}

function get_workshop_upgrade_prices(upgrade_name){
    let controller = new com.nuclearunicorn.game.ui.UpgradeButtonController(this.game)
    let model = controller.fetchModel({id: upgrade_name})
    return controller.getPrices(model)
}

function upgrade_workshop_func(index){
    let upgrade = this.game.workshop.upgrades[index]

    if (upgrade.unlocked && !upgrade.researched) {
        let controller = new com.nuclearunicorn.game.ui.UpgradeButtonController(this.game)
        let model = controller.fetchModel({id: upgrade.name})
        let prices = controller.getPrices(model)
        if (is_resource_enough(prices)){
            remove_short_resource('upgrade', upgrade.name)
            pay(prices)
            model.prices = controller.getPrices(model)

            this.game.workshop.unlock(upgrade)
            console.log('workshop upgrade: ' + upgrade.name)
        } else {
            if (_is_resource_limited(prices)){
                record_short_resource('upgrade', upgrade.name, prices, true)
            }else{
                record_short_resource('upgrade', upgrade.name, prices, false)
            }
        }
    }
}

function send_hunters(squads=1){
    if (get_resource_value("manpower") >= squads * 100){
        this.game.resPool.addResEvent("manpower", -squads * 100);
        this.game.village.sendHunters()
        this.game.village.gainHuntRes(squads);
        this.game.village.updateHappines()
        //setTimeout(()=>{console.log('send hunter(hanppiness): ' + get_happiness())}, 50)
    }
}

function hold_festival(is_force=false){
    if (!is_science_researched('drama'))return
    if (is_festival() && !is_force)return

    let prices = get_festival_prices()
    if (is_resource_enough(prices)){
        remove_short_resource('other', 'festival')
        pay(prices)
        this.game.village.holdFestival(1)
        console.log('hold_festival')
    }else{
        //一般parchment与culture不够，直接升优先级
        record_short_resource('other', 'festival', prices, false)
        incr_shorted_resource_priority('festival', 'other')
    }
}

function get_festival_prices(){
    return [
                { name : "manpower", val: 1500 },
                { name : "culture", val: 5000 },
                { name : "parchment", val: 2500 }
           ]
}

function is_festival(){
    return this.game.calendar.festivalDays > 0
}

function get_craft_all_account(craft_name){
    //returns a total number of resoruces possible to craft for this recipe
    if(!can_craft(craft_name))return 0
    return this.game.workshop.getCraftAllCount(craft_name)
}

function craft_for_short_resource(craft_name){
    if (ai_craft(craft_name) > 0) return true
    let prices = get_craft_prices(craft_name)
    if (_is_resource_limited(prices)){
        record_short_resource('craft', craft_name, prices, true)
    } else{
        record_short_resource('craft', craft_name, prices, false)
    }
    return false
}

function is_craft_match_craft_condition(craft_name, is_log=false){
    let resource_options = auto_options.craft.resource
    for (var res_name in resource_options){
        let resource_option = resource_options[res_name]
        if (resource_option.condition){
            let condition_option = resource_option.condition
            if (condition_option.priority && has_priority_resource()){
                let short_res = short_resource()
                let srcBuildingNoUpgrade_value = condition_option.priority.srcBuildingNoUpgrade
                if (is_log) console.log(1, res_name, short_res, craft_name, srcBuildingNoUpgrade_value)
                if (short_res.type = 'craft' && short_res.name == res_name && srcBuildingNoUpgrade_value){
                    if (is_log) console.log(2, res_name, srcBuildingNoUpgrade_value)
                    for (var j in srcBuildingNoUpgrade_value){
                        if (is_craft_need_resource(craft_name, srcBuildingNoUpgrade_value[j])){
                            return false
                        }
                    }
                }
            }
        }
    }
    return true
}

function is_craft_need_resource(craft_name, resource){
    let prices = get_craft_prices(craft_name)
    for(var i in prices){
        let price = prices[i]
        if (price.name == resource)return true
    }
    return false
}

function craft_if_need(craft_name, number=1, is_log=false){
    if (!is_craft_match_craft_condition(craft_name, is_log))return 0
    return craft(craft_name,number, is_log)
}

function craft(craft_name, number=1, is_log=false){
    let minAmt = get_craft_all_account(craft_name)
    minAmt = Math.min(minAmt, number)
    if (minAmt <= 0)return 0
    let is_ok = this.game.workshop.craft(craft_name, minAmt,
        false /* allow undo */,
        false /* don't force all */,
        true /* bypass resource check */)
    if (is_ok){
        if (is_log){
            console.log('craft ' + craft_name + ": " + minAmt)
        }
    }
    this.game.updateResources()
    return minAmt
}

function get_craft_min_count(resource){
    //页面左下角的资源，craft最小值
    if (!can_craft(resource))return 0
    var all_count = this.game.workshop.getCraftAllCount(resource)
    return Math.max(1, Math.floor(all_count * 0.01))
}

function craft_all(craft_name){
    this.game.craftAll(craft_name)
    this.game.updateResources()
}

function get_craft(craft_name){
    return this.game.workshop.getCraft(craft_name)
}

function get_craft_prices(craft_name){
    let craft = get_craft(craft_name)
    if (craft == undefined || !craft)return null
    return this.game.workshop.getCraftPrice(craft)
}

function get_craft_price_of_res(craft_name, res_name){
    let prices = get_craft_prices(craft_name)
    if (prices == undefined)return 0
    for (var i in prices){
        if (prices[i].name != res_name)continue
        return prices[i].val
    }
    return 0
}

function praise_all(){
    this.game.religion.praise()
}

function auto_praise(){
    if (!has_page("Religion"))return

    if (this.game.religion.faith <= 0){
        if (get_resource_value('faith') > 10){
            praise_all()
        }
    }

    this.game.religion.religionUpgrades.forEach((upgrade)=>{
        if (this.game.religion.faith < upgrade.faith){
            if (this.game.religion.faith + get_resource_value('faith') >= upgrade.faith){
                praise_all()
            }
        }else{
            if (upgrade.val <= 0 || !upgrade.noStackable){
                var controller = new com.nuclearunicorn.game.ui.ReligionBtnController(this.game);
                var model = controller.fetchModel({id: upgrade.name})
                let prices = controller.getPrices(model)
                if (is_resource_enough(prices)) {
                    pay(prices)
                    model.prices = prices
                    upgrade.val += 1
                    upgrade.on += 1

                    console.log('religion upgrade: ' + upgrade.name)
                }
            }
        }
    })

    if (is_resource_will_full('faith', 0.99)){
        praise_all()
    }
}


function has_unlocked_races(){
    //trade
    return this.game.diplomacy.hasUnlockedRaces()
}

function get_all_unlock_races(){
    let result = []
    let races = this.game.diplomacy.races
    for (var i = 0; i < races.length; i++) {
        var race = races[i];
        if (race.unlocked) {
            result.push(race)
        }
    }
    return result
}

function get_best_trade_by_resource(resource){
    //根据资源查找最佳的交易race
    //is_filter: 当交易数据过小时是否直接随机过滤掉
    var baseTradeRatio = 1 + this.game.diplomacy.getTradeRatio();
    var currentSeason = this.game.calendar.getCurSeason().name;
    let races = this.game.diplomacy.races
    let meet_races = []
    for (var i = 0; i < races.length; i++) {
        var race = races[i];
        if (!race.unlocked) {
            continue;
        }
        let min = 0;
        let max = 0;
        var tradeRatio = baseTradeRatio + this.game.diplomacy.calculateTradeBonusFromPolicies(race.name, this.game)
            + this.game.challenges.getChallenge("pacifism").getTradeBonusEffect(this.game);
        for (var j = 0; j < race.sells.length; j++) {
            var s = race.sells[j];
            if (s.name != resource){
                continue
            }
            if (!this.game.diplomacy.isValidTrade(s, race)) {
                continue;
            }

            var average = s.value * tradeRatio * (1 + race.energy * 0.02) * (1 + (s.seasons ? s.seasons[currentSeason] : 0));
            min = this.game.getDisplayValueExt(average * (1 - s.width / 2), false, false, 0)
            max = this.game.getDisplayValueExt(average * (1 + s.width / 2), false, false, 0)

        }
        if (race.name == "zebras" && resource == "titanium") {
            var zebraRelationModifierTitanium = this.game.getEffect("zebraRelationModifier") * this.game.bld.getBuildingExt("tradepost").meta.effects["tradeRatio"];
            var displayedVal = this.game.getDisplayValueExt((1.5 + this.game.resPool.get("ship").value * 0.03) * (1 + zebraRelationModifierTitanium), false, false, 0);
            min = displayedVal
            max = displayedVal
        }

        if (max <= 0)continue
        meet_races.push([race, parseInt(min), parseInt(max)])
    }

    let best_race = null
    let true_max = 0
    for (var i = 0; i < meet_races.length; i++) {
        if (meet_races[i][2] > true_max){
            true_max = meet_races[i][2]
            best_race = meet_races[i]
        }
    }
    if (!best_race)return null
    return {race: best_race[0], max: true_max}
}

function get_max_from_trade_by_resource(resource){
    //根据资源查找最佳的交易race
    //is_filter: 当交易数据过小时是否直接随机过滤掉
    let max_info = get_best_trade_by_resource(resource)
    if (!max_info)return 0
    return max_info.max
}

function get_best_race_by_resource(resource, is_filter=true){
    //根据资源查找最佳的交易race
    //is_filter: 当交易数据过小时是否直接随机过滤掉
    let max_info = get_best_trade_by_resource(resource)
    if (!max_info)return null
    if (is_filter && max_info.max < 5){
        //随机 0~9
        if (random_number(10) < max_info.max + 1){
            return max_info.race
        }else{
            return null
        }
    }
    return max_info.race
}

function random_list(list_info){
    //随机选取list中的一个
    return list_info[Math.floor(Math.random() * list_info.length)]
}

function random_number(max_not_include){
    //不包含max_not_include
    return Math.floor(Math.random() * max_not_include)
}

function get_unlocked_races(){
    let races = this.game.diplomacy.races
    let meet_races = []
    for (var i = 0; i < races.length; i++) {
        var race = races[i];
        if (!race.unlocked) {
            continue;
        }
        meet_races.push(race)
    }
    return meet_races
}

function get_can_trade_races(){
    let races = this.game.diplomacy.races
    let meet_races = []
    for (var i = 0; i < races.length; i++) {
        var race = races[i];
        if (!race.unlocked) {
            continue;
        }
        if (this.game.diplomacy.getMaxTradeAmt(race) <= 0)continue
        meet_races.push(race)
    }
    return meet_races
}

function get_can_trade_races_if_buys_enough(threshold=0.95){
    let races = this.game.diplomacy.races
    let meet_races = []
    for (var i = 0; i < races.length; i++) {
        var race = races[i];
        if (!race.unlocked) {
            continue;
        }

        let is_excluded = false
        race.buys.forEach((res_data)=>{
            if (is_excluded)return
            if (is_resource_will_empty(res_data.name, threshold)){
                is_excluded = true
                return
            }
        })

        if (is_excluded)continue
        if (this.game.diplomacy.getMaxTradeAmt(race) <= 0)continue
        meet_races.push(race)
    }
    return meet_races
}



function trade(race_name, amt=1){
    //race: lizards, sharks, griffins, nagas, zebras, spiders, dragons, leviathans
    let max_amt = get_max_trade_amt(race_name)
    let trade_amt = Math.min(amt, max_amt)
    _record_game_event_data('trade', {race: race_name})
    if (trade_amt > 0){
        let race = get_race(race_name)
        console.log(race_name + ' trade: ' + trade_amt, race.sells)
        return this.game.diplomacy.tradeMultiple(race, trade_amt)
    }
}

function trade_all(race_name){
    let amt =get_max_trade_amt(race_name)
    if (amt > 0){
       console.log(race_name + ' trade all: ' + amt)
       return this.game.diplomacy.tradeAll(get_race(race_name))
    }
}

function get_max_trade_amt(race_name){
    let race =get_race(race_name)
    return this.game.diplomacy.getMaxTradeAmt(race)
}

function get_race(race_name){
    return this.game.diplomacy.get(race_name)
}

function upgrade_embassy(race_name) {
    if (!has_page('Trade'))return
    //race: lizards, sharks, griffins, nagas, zebras, spiders, dragons, leviathans
    let race = get_race(race_name)
    if (!race.unlocked){
        return
    }
    let controller = new classes.diplomacy.ui.EmbassyButtonController(this.game)
    let model = controller.fetchModel({race: race, prices: race.embassyPrices})
    let prices = controller.getPrices(model)
    if (is_resource_enough(prices)) {
        pay(prices)
        model.prices = prices

        controller.incrementValue(model)
        console.log('trade upgrade: ' + race.name)
        return true
    }else{
        if (_is_resource_limited(prices)){
            record_short_resource('trade', race.name, prices, true)
        }else{
            record_short_resource('trade', race.name, prices, false)
        }
    }
    return false
}

function upgrade_all_embassy() {
    if (is_base_resource_short_for_upgrade('culture'))return
    let length = this.game.diplomacy.races.length-1
    for (var i=0; i<length; i++) {
        let race = this.game.diplomacy.races[i]
        upgrade_embassy(race.name)
    }
}

function is_all_races_can_not_upgrade(is_log=false){
    let length = this.game.diplomacy.races.length-1
    for (var i=0; i<length; i++) {
        let race = this.game.diplomacy.races[i]
        if (!race.unlocked)continue
        let controller = new classes.diplomacy.ui.EmbassyButtonController(this.game)
        let model = controller.fetchModel({race: race, prices: race.embassyPrices})
        let prices = controller.getPrices(model)
        for(var j in prices){
            if (get_resource_maxvalue(prices[j].name) >= prices[j].val ) {
                if (is_log) console.log('race can upgrade：', race.name, prices, get_resource_maxvalue(prices[j].name))
                return false
            }
        }
    }
    return true
}

function send_explorers(){
    let prices = [{ name: "manpower", val: 1000}]
    if (is_resource_enough(prices)) {
        pay(prices)
        let controller = new classes.trade.ui.SendExplorersButtonController(this.game)
        controller.clickHandler(undefined, undefined)
        console.log('send_explorers')
    }
}

function auto_space(){
    if (!has_page('Space'))return

    let programs_controller = new com.nuclearunicorn.game.ui.SpaceProgramBtnController(this.game)
    this.game.space.programs.forEach((program_data)=>{
        let model = programs_controller.fetchModel({id: program_data.name})
        if (!model.visible)return
        //以on为判断，大于零相当研究过了
        if (model.on > 0)return
        if (model.resourceIsLimited)return
        if (is_resource_enough(model.prices)) {
            // pay(model.prices)
            // let program = this.game.space.getProgram(program_data.name)
            // program.on = 1
            // program.val = 1
            // this.game.unlock(program.unlocks)
            // this.game.space.update()
            programs_controller.build(model, 1)
        }else {
            if (_is_resource_limited(model.prices)){
                record_short_resource('program', program_data.name, model.prices, true)
            }else{
                record_short_resource('program', program_data.name, model.prices, false)
            }
        }
    })
}

function is_send_explorers(){
    var unconditon_races = ['lizards', 'sharks', 'griffins']
    for (var i in unconditon_races){
        if (!get_race(unconditon_races[i]).unlocked){
            return true
        }
    }

    var nagas = get_race('nagas')
    if (!nagas.unlocked && this.game.resPool.get("culture").value >= 1500){
        return true
    }

    var zebras = get_race("zebras");
    if (!zebras.unlocked && this.game.resPool.get("ship").value >= 1){
        return true
    }

    var spiders = get_race("spiders");
    if (!spiders.unlocked && this.game.resPool.get("ship").value >= 100
        && this.game.resPool.get("science").maxValue > 125000){
        return true;
    }

    var dragons = get_race("dragons");
    if (!dragons.unlocked && this.game.science.get("nuclearFission").researched){
        return true;
    }

    return false
}

function get_building_groups(_building_group_type){
    if (_building_group_type == 'energy'){
        return get_buildings_which_promote_res('energy')
    }
    var groups = this.game.bld.buildingGroups
    for (var i in groups){
        if (_building_group_type == groups[i].name){
            return groups[i].buildings
        }
    }
}

function show_building_groups(){
    return this.game.bld.buildingGroups
}

function upgrade_building_group(_building_group_type){
    var buildings = get_building_groups(_building_group_type)
    for (var i in buildings){
        upgrade_building(buildings[i], 1)
    }
}

function upgrade_building_group_if_need(_building_group_type){
    var buildings = get_building_groups(_building_group_type)
    for (var i in buildings){
        if (_building_group_type == 'energy'){
            upgrade_building_if_need(buildings[i].name, 1, buildings[i].planet)
        }else{
            upgrade_building_if_need(buildings[i], 1)
        }
    }
}

function get_day_of_current_season(){
    return this.game.calendar.day
}

function get_current_season(){
    return this.game.calendar.getCurSeasonTitle()
}

function get_current_year(){
    return this.game.calendar.year
}

function observe_the_sky(){
    if (this.game.calendar.observeRemainingTime > 0){
        this.game.calendar.observeHandler()
        console.log('observe the sky')
    }
}

function updateUI(){
    this.game.render()
}

function get_ticks_per_second(){
    return this.game.ticksPerSecond
}

function get_energy_value(){
    if (get_current_season() == 'Winter'){
        return game.resPool.energyWinterProd - game.resPool.energyCons
    }
    return game.resPool.energyProd - game.resPool.energyCons
}

function get_energy_value_in_winter(){
    return game.resPool.energyWinterProd - game.resPool.energyCons
}

function is_energy_emergency(){
    //是否能源告急
    return get_energy_value_in_winter() < 0
}