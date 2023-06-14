function ai_craft(res_name, craft_num=undefined, is_log=false){
    let resources = auto_options.craft.strategies
    let strategies = resources[res_name]
    if (strategies == undefined)return
    strategies.forEach((strategy)=>{
        let craft_need_num = get_craft_price_of_res(res_name, strategy.name)
        if (craft_num){
            craft_need_num = craft_need_num * craft_num
        }
        if (is_log) console.log(strategy.name, craft_need_num,  craft_num)
        if (strategy.name != res_name && get_resource_value(strategy.name) >= craft_need_num){
            return
        }
        if (craft_num && strategy.name == res_name){
            craft_need_num = craft_num
        }
        if (is_log) console.log(2, strategy.name, strategy.type, craft_need_num,  craft_num)
        if (strategy.type == 'number'){
            return craft_if_need(strategy.name, strategy.value)
        }else if (strategy.type == 'percentage'){
            var all_count = this.game.workshop.getCraftAllCount(strategy.name)
            if (is_log) console.log(3, strategy.name, strategy.type, all_count,  craft_need_num)
            if (craft_num && all_count <= craft_need_num){
                return craft_if_need(strategy.name, all_count)
            }
            var value = Math.max(1, Math.min(craft_need_num, Math.ceil(all_count * strategy.value)))
            if (craft_need_num == 0){
                value = Math.max(1, Math.ceil(all_count * strategy.value))
            }
            if (is_log) console.log(4, strategy.name, strategy.type, value)
            return craft_if_need(strategy.name, value)
        }else if (strategy.type == 'father'){
            if (is_log) console.log(5, strategy.name, strategy.type, craft_need_num,  craft_num)
            ai_craft(strategy.name, craft_need_num)
        }else{
            console.log(strategy, 'error')
        }
    })
    return 0
}


function monitor_craft(is_log=false){
    let craft_resources_options = auto_options.craft.resource
    for(var res_name in craft_resources_options){
        let craft_res_option = craft_resources_options[res_name]
        if (craft_res_option.priorityWhen != undefined){
            if (has_priority_resource() && is_resource_short_for_upgrade(res_name)){
                let priorityWhen_option = craft_res_option.priorityWhen
                if (priorityWhen_option.need_resources != undefined){
                    priorityWhen_option.need_resources.forEach((need_res)=>{
                        if (get_resource_value(need_res.name) < need_res.value){
                            ai_craft(need_res.name, need_res.value - get_resource_value(need_res.name))
                        }
                    })
                }
            }
        }

        let craft_obj = get_craft(res_name)
        if (craft_res_option['val' + get_resource_value(res_name)]){
            let craft_res_option_valX = craft_res_option['val' + get_resource_value(res_name)]
            handle_config_immediately(craft_obj.name, craft_res_option_valX.immediately, 'craft', 'earth', is_log)
        }

        if (craft_res_option['valX']){
            let craft_res_option_valX = craft_res_option['valX']
            if (is_log)console.log('valX', craft_obj.name, craft_res_option_valX.immediately)
            handle_config_immediately(craft_obj.name, craft_res_option_valX.immediately, 'craft', 'earth', is_log)
        }

        if (craft_res_option.craft_res){
            craft_res_option.craft_res.forEach((craft_name)=>{
                handle_config_immediately(craft_name, craft_res_option.immediately, 'craft', 'earth', is_log)
            })
        }
    }

    let res_dataset = get_res_dataset()
    for(var i in res_dataset){
        let res_data = res_dataset[i]
        let craft_res_option = craft_resources_options[res_data.name]

        let full_threshold = 0.95
        let is_craftWhenFull = true
        if (craft_res_option && craft_res_option.craftWhenFull){
            if (craft_res_option.craftWhenFull.value){full_threshold = craft_res_option.craftWhenFull.value}
            is_craftWhenFull = check_config_noShortRes(craft_res_option.craftWhenFull.noShortRes)

            if (is_craftWhenFull && craft_res_option.craftWhenFull.allRacesLimitedCulture){
                let allRacesLimitedCulture_value = craft_res_option.craftWhenFull.allRacesLimitedCulture
                if (is_all_races_can_not_upgrade() != allRacesLimitedCulture_value){
                    is_craftWhenFull = false
                }
            }
            for (var key in craft_res_option.craftWhenFull){
                if (!is_craftWhenFull)break
                if (!is_match_obj_config(key, craft_res_option.craftWhenFull[key])){
                    is_craftWhenFull = false
                    break
                }
            }
        }

        if (is_craftWhenFull && is_resource_will_full(res_data.name, full_threshold)){
            if (craft_res_option && craft_res_option.craft_res){
                craft_res_option.craft_res.forEach((res_name)=>{
                    //当coal即将满时，要转化steel，刚好iron是升级所需资源时，不做转化
                    if (res_name == 'steel' && res_data.name == 'coal'){
                        if (is_resource_short_for_upgrade('iron'))return
                    }
                    if (is_resource_full(res_data.name)){
                        craft(res_name, get_craft_min_count(res_name))
                    }
                    let craft_need_num = get_craft_price_of_res(res_name, res_data.name)
                    let amt = 1
                    if (craft_need_num > 0){
                        amt = Math.max(1,
                            Math.ceil(get_resource_ratio(res_data.name)/craft_need_num))
                    }
                    craft(res_name, amt)
                })
            }
        }

        if (craft_res_option && craft_res_option.craftWhenRatioLe0){
            if (get_resource_ratio(res_data.name) <= 0){
                if (craft_res_option && craft_res_option.craft_res){
                    craft_res_option.craft_res.forEach((res_name)=>{
                        craft(res_name, 100)
                    })
                }
            }
        }

        if (craft_res_option && craft_res_option.timer){
            let timer_option = craft_res_option.timer
            let is_match = true
            for (var src_key in timer_option){
                if (!is_match_obj_config(src_key, timer_option[src_key])){
                    is_match = false
                    break
                }
            }

            let cycle = 60
            if (timer_option.cycle_unit_s){
                cycle = timer_option.cycle_unit_s
            }
            if (is_match && is_tick_match_cycle(cycle)){
                //console.log('timer craft: ' + res_data.name)
                if (craft_res_option.craft_res){
                    craft_res_option.craft_res.forEach((res_name)=>{
                        craft(res_name, get_craft_min_count(res_name))
                    })
                }else{
                    craft(res_data.name, get_craft_min_count(res_data.name))
                }
            }
        }
    }
}

function auto_craft(){
    if (!has_page('Workshop')){
        return
    }

    setTimeout(()=>{
        monitor_craft()
    }, 10)

    if (has_priority_resource()) {
        let shor_data = short_resource()
        shor_data.res.forEach((res) => {
            ai_craft(res.name, res.need_val)
        })
        return
    }
}


function get_craft_depends_auto_produce_if_need(craft_name){
    //依赖那些可以自动生产的资源
    //去掉已经充足的资源
    let result = []
    if (get_resource_ratio(craft_name) != 0){
        result.push(craft_name)
        if (craft_name == 'furs'){
            result.push('manpower')
        }
    }

    let prices = get_craft_prices(craft_name)
    if (!prices)return result
    for(var i in prices){
        let res = this.game.resPool.get(prices[i].name)
        if (res.value > prices[i].val)continue
        if (get_resource_ratio(prices[i].name) != 0){
            result.push(prices[i].name)
            if (prices[i].name == 'furs'){
                result.push('manpower')
            }
        }

        if (res.craftable != undefined && res.craftable){
            result = result.concat(get_craft_depends_auto_produce(prices[i].name))
        }
    }

    if (craft_name != 'wood'){
        result = result.filter((res_name)=>{
            return res_name != 'catnip'
        })
    }
    return Array.from(new Set(result))
}

function get_craft_depends_auto_produce(craft_name){
    //依赖那些可以自动生产的资源
    let result = []
    if (get_resource_ratio(craft_name) != 0){
        result.push(craft_name)
        if (craft_name == 'furs'){
            result.push('manpower')
        }
    }

    let prices = get_craft_prices(craft_name)
    if (!prices)return result
    for(var i in prices){
        let res = this.game.resPool.get(prices[i].name)
        if (get_resource_ratio(prices[i].name) != 0){
            result.push(prices[i].name)
            if (prices[i].name == 'furs'){
                result.push('manpower')
            }
        }

        if (res.craftable != undefined && res.craftable){
            result = result.concat(get_craft_depends_auto_produce(prices[i].name))
        }
    }

    if (craft_name != 'wood'){
        result = result.filter((res_name)=>{
            return res_name != 'catnip'
        })
    }
    return Array.from(new Set(result))
}

function get_craft_depends_craft(craft_name){
    //依赖那些可以必须craft的资源
    let result = []
    let prices = get_craft_prices(craft_name)
    if (!prices)return []
    for(var i in prices){
        let res = this.game.resPool.get(prices[i].name)
        if (res.craftable != undefined && res.craftable){
            result.push(prices[i].name)
            result = result.concat(get_craft_depends_craft(prices[i].name))
        }
    }
    return Array.from(new Set(result))
}

function can_craft(craft_name){
    let craft = get_craft(craft_name)
    if (craft == undefined || !craft)return false
    return craft.unlocked && !craft.isLimited
}