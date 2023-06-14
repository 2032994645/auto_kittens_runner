try{
    if (short_resource_data.length <= 0){
        short_resource_data = []
    }
}catch (e){
    short_resource_data = []
}

common_priority = 100

function record_short_resource(_short_resource_type, name, prices, is_storage_limited, planet='earth'){
    let data = {}
    data['type'] = _short_resource_type
    data['name'] = name
    data['priority'] = common_priority
    data['prices'] = prices
    data['planet'] = planet
    data['is_storage_limited'] = is_storage_limited
    //优先级，值越大，优先级越高
    let old_data = get_short_resource(_short_resource_type, name)
    if (old_data){
        old_data['prices'] = data['prices']
        old_data['is_storage_limited'] = data['is_storage_limited']
    }else{
        short_resource_data.push(data)
    }

    sort_resource_data()
}

function has_priority_resource(){
    //是否存在高优先级的资源
    return get_short_resource_max_priority() > common_priority
}

function incr_shorted_resource_priority(name, _short_resource_type=undefined){
    let data = get_short_resource(_short_resource_type, name)
    if(data){
        if (data.priority > common_priority){
            return false
        }
        data.priority = get_short_resource_max_priority() + 1
        sort_resource_data()
        return true
    }
    return false
}

function sort_resource_data(){
    short_resource_data.sort(function (a, b) {
        return  b.priority - a.priority;
    });
}

function get_short_resource_max_priority(){
    let res_data = short_resource_data
    let max = 0
    for(var i=0; i<res_data.length; i++){
        let data = res_data[i]
        if (data.priority > max){
            max = data.priority
        }
    }
    return max
}

function get_short_resource(_short_resource_type, name){
    let res_data = short_resource_data
    for(var i=0; i<res_data.length; i++){
        let data = res_data[i]
        if (_short_resource_type) {
            if (data['type'] == _short_resource_type && data['name'] == name) {
                return data
            }
        }else{
            if (data['name'] == name) {
                return data
            }
        }
    }
    return null
}

function remove_short_resource(_short_resource_type, name){
    for(var i=0; i<short_resource_data.length; i++){
        let data = short_resource_data[i]
        if (data['type'] == _short_resource_type && data['name'] == name){
            short_resource_data.splice(i, 1)
        }
    }
}

function limited_resource(){
    let limited_res = {}
    limited_res['limites'] = []
    limited_res['res'] = []
    limited_res['need_res'] = []
    for(var i=0; i<short_resource_data.length; i++) {
        let data = short_resource_data[i]
        limited_res['type'] = data['type']
        limited_res['name'] = data['name']
        limited_res['planet'] = data['planet']
        limited_res['priority'] = data['priority']
        if (data['is_storage_limited']){
            let prices = data['prices']
            for(var j in prices){
                let need_resource = {}
                let value = prices[j].val
                limited_res['need_res'].push({name: prices[j].name, val: value})
                if (get_resource_maxvalue(prices[j].name) < value){
                    need_resource['name'] = prices[j].name
                    need_resource['val'] = value
                    need_resource['need_val'] = value - get_resource_maxvalue(prices[j].name)
                    limited_res['limites'].push(prices[j].name)
                }
                if (Object.keys(need_resource).length > 0){
                    limited_res['res'].push(need_resource)
                }
            }
            break
        }
    }
    return limited_res
}

function show_short(){
    let short_res = short_resource()
    console.log(short_res.name + "(" + short_res.type + ")", short_res.priority)
    console.log("prices:")
    short_res.res.forEach((res)=>{
        console.log("  ", res)
    })
}

function show_base_short(){
    let short_res = base_short_resource()
    console.log(short_res.name + "(" + short_res.type + ")", short_res.priority)
    console.log("prices(base):")
    short_res.base_res.forEach((res)=>{
        console.log("  ", res)
    })
}

let stop_show_short_timer = false
function show_short_timer(){
    setTimeout(()=>{
        show_base_short()
        show_short()
        if (!stop_show_short_timer){
            show_short_timer()
        }
    }, 5000)
}

function add_resource_to_short(){
    let short_res = short_resource()
    if (short_res.priority <= common_priority){
        console.log(short_res.name + "(" + short_res.type + ")", short_res.priority + '<=' + common_priority)
        return
    }

    short_res.res.forEach((res)=>{
        add_resource(res.name, res.need_val)
    })
}

function base_short_resource(){
    //底层真正可自动生成资源
    let base_short_res = {}
    let short_data = short_resource()
    base_short_res['type'] = short_data['type']
    base_short_res['name'] = short_data['name']
    base_short_res['planet'] = short_data['planet']
    base_short_res['priority'] = short_data['priority']
    base_short_res['res'] = short_data['res']
    base_short_res['need_res'] = short_data['need_res']
    base_short_res['base_res'] = []

    for (var i in short_data['res']){
        let need_res = short_data['res'][i]
        _base_short_resource(base_short_res, need_res)
    }
    return base_short_res
}

function _base_short_resource(base_short_res, need_res){
    let src_res = this.game.resPool.get(need_res.name)
    let is_add = false
    if (get_resource_ratio(need_res.name) != 0){
        //如果本身可以生产，先加上
        if (src_res.value < need_res.val) {
            base_short_res['base_res'].push({
                name: need_res.name,
                val: need_res.val,
                need_val: need_res.val - src_res.value,
            })

            if (need_res['name'] == 'furs'){
                let ex_need_resource = {}
                ex_need_resource['name'] = 'manpower'

                var hunterRatio = this.game.getEffect("hunterRatio") + this.game.village.getEffectLeader("manager", 0);
                ex_need_resource['val'] = need_res.val * (80 * this.game.math.irwinHallRandom(1) + 65 * hunterRatio * this.game.math.irwinHallRandom(1))
                ex_need_resource['need_val'] = ex_need_resource['val'] - get_resource_value('manpower')
                base_short_res['base_res'].push(ex_need_resource)
            }
        }
        is_add = true
    }

    let craft_prices =  get_craft_prices(need_res.name)
    let min_craft_num = Number.MAX_SAFE_INTEGER
    let min_craft_price = undefined
    if (craft_prices){
        for (var j in craft_prices){
            //不用专门转化catnip
            if (craft_prices[j].name == 'catnip'){
                continue
            }
            let craft_res = this.game.resPool.get(craft_prices[j].name)
            let can_craft_num = craft_res.value / craft_prices[j].val
            //寻找最缺的资源
            //比如合成compendium需要science与manuscript，虽然两者总量都是缺的，
            // 但在单次合成时，有可能manuscript很多，但science由于容量小，每合成几个后，science就需要重新等待数量，
            //这样看，其实真正缺的是science
            if (can_craft_num < min_craft_num){
                min_craft_num = can_craft_num
                min_craft_price = craft_prices[j]
            }

            // let sub_need_res = {name: craft_prices[j].name,
            //                     val: craft_prices[j].val * need_res['need_val'],
            //                     need_val: craft_prices[j].val * need_res['need_val'] - craft_res.value}
            // _base_short_resource(base_short_res, sub_need_res)
        }

        if (min_craft_price){
            let sub_need_res = {name: min_craft_price.name,
                                val: min_craft_price.val * need_res['need_val'],
                                need_val: min_craft_price.val * need_res['need_val']
                                    - this.game.resPool.get(min_craft_price.name).value}
            _base_short_resource(base_short_res, sub_need_res)
        }
        return
    }

    if (!is_add){
        base_short_res['base_res'].push(need_res)
    }
}

function short_resource(){
    let short_res = {}
    short_res['limites'] = []
    short_res['res'] = []
    short_res['need_res'] = []
    for(var i=0; i<short_resource_data.length; i++) {
        let data = short_resource_data[i]
        short_res['type'] = data['type']
        short_res['name'] = data['name']
        short_res['planet'] = data['planet']
        short_res['priority'] = data['priority']
        let prices = data['prices']
        let read_prices = prices.concat([])
        get_config_short_resources().forEach((config_short_res)=>{
            if (get_value_from_prices(read_prices, config_short_res) <= 0){
                read_prices.push({name: config_short_res, val: 2500})
            }
        })
        for(var j in read_prices){
            let need_resource = {}
            let value = read_prices[j].val
            short_res['need_res'].push({name: read_prices[j].name, val: value})
            if (get_resource_value(read_prices[j].name) < value){
                need_resource['name'] = read_prices[j].name
                need_resource['val'] = value
                need_resource['need_val'] = value - get_resource_value(read_prices[j].name)
                if (get_resource_maxvalue(read_prices[j].name) < value){
                    short_res['limites'].push(read_prices[j].name)
                }
            }
            if (Object.keys(need_resource).length > 0){
                short_res['res'].push(need_resource)
            }
        }
        if (short_res['res'].length <= 0){
            if (data['type'] == 'building'){
                upgrade_building(data['name'], 1, data['planet'])
            } else if (data['type'] == 'craft'){
                craft(data['name'])
            }

            short_resource_data.splice(0, 1)
            return short_resource()
        }
        break
    }
    return short_res
}

function is_resource_short_for_upgrade(name){
    if (!has_priority_resource())return false
    let short_data = short_resource()
    for (var i in short_data['res']){
        if (short_data['res'][i].name == name){
            return true
        }
    }

    let config_short_data = get_config_short_resources()
    for (var i in config_short_data){
        if (config_short_data[i] == name){
            return true
        }
    }

    return false
}

function is_base_resource_short_for_upgrade(name){
    if (!has_priority_resource())return false
    let short_data = base_short_resource()
    for (var i in short_data['base_res']){
        if (short_data['base_res'][i].name == name){
            return true
        }
    }

    let config_short_data = get_config_short_resources()
    for (var i in config_short_data){
        let base_resources = get_craft_depends_auto_produce(config_short_data[i])
        for(var j=0; j<base_resources.length; j++){
            if (base_resources[j] == name){
                return true
            }
        }
    }

    return false
}

function is_resource_limited_for_upgrade(name){
    let short_data = short_resource()
    for (var i in short_data['res']){
        if (short_data['res'][i].name == name) {
            if (short_data['limites'].indexOf(name) >= 0) {
                return true
            }
        }
    }
    return false
}

function add_bld_priority_upgrade(bldname, planet='earth'){
    //优先升级建筑
    let controller = new classes.ui.btn.BuildingBtnModernController(this.game);
    let model = controller.fetchModel({
        key: bldname,
        building: bldname
    });

    let prices = controller.getPrices(model)
    if (_is_resource_limited(prices)){
        record_short_resource('building', bldname, prices, true, planet)
    }else{
        record_short_resource('building', bldname, prices, false, planet)
    }
    incr_shorted_resource_priority(bldname, 'building')
}

function get_still_require_resource(prices){
    let short_data = []
    for(var i in prices){
        let data = {}
        if(get_resource_value(prices[i].name) < prices[i].val){
            data['name'] = prices[i].name
            data['val'] = prices[i].val
        }
        if (Object.keys(data).length > 0){
            short_data.push(data)
        }
    }
    return short_data
}

function auto_incr_resource_priority(){
    let resource_option = auto_options.resource
    let max_priority = 0
    for (var res_name in resource_option){
        let res_option = resource_option[res_name]
        if (res_option.incr_priority == undefined)continue
        let incr_priority_option = res_option.incr_priority
        let priority = incr_priority_option.priority
        if (priority && max_priority < priority){
            max_priority = priority
        }
    }
    for (var i=1; i<=max_priority; i++){
        if (has_priority_resource())return
        let incr_resources = get_incr_resources(i)
        scan_and_incr_shorted_resource_priority(i, incr_resources, false)
    }

    if (!has_priority_resource()){
        auto_incr_resource_priority_last()
    }
}

function get_incr_resources(index = 1){
    let resource_option = auto_options.resource
    let result = []
    for (var res_name in resource_option){
        let res_option = resource_option[res_name]
        if (res_option.incr_priority == undefined)continue
        let incr_priority_option = res_option.incr_priority
        let priority = incr_priority_option.priority
        if (priority == undefined || priority > index)continue
        let is_match = true
        for(var incr_priority_key in incr_priority_option){
            if (!is_match_obj_config(incr_priority_key, incr_priority_option[incr_priority_key])){
                is_match = false
                break
            }
            if (incr_priority_key == 'upgrades'){
                if (!is_match_upgrades_config(incr_priority_option[incr_priority_key])){
                    is_match = false
                    break
                }
            }
            if (incr_priority_key == 'tech'){
                if (!is_match_tech_config(incr_priority_option[incr_priority_key])){
                    is_match = false
                    break
                }
            }
        }
        if (is_match) result.push(res_name)
    }

    return Array.from(new Set(result))
}

function auto_incr_resource_priority_last(){
    //优先升级人口
    upgrade_building_group('population')

    //提升没有limited的人口建筑
    let foot_groups = get_building_groups('population')
    for(var i in short_resource_data) {
        let data = short_resource_data[i]
        let is_population_bld = false
        for (var j in foot_groups){
            if (get_resource_ratio('titanium') <= 0.1 && data.name == 'mansion' || data.name == 'mansion'){
                break
            }
            if (data.name == foot_groups[j]){
                is_population_bld = true
                break
            }
        }
        if (!is_population_bld)continue
        let need_resource = get_still_require_resource(data['prices'])
        if (data.type == 'building'){
            let is_incr = true
            need_resource.forEach((res)=>{
                if (!is_incr)return
                if (get_resource_maxvalue(res.name) < res.val) {
                    is_incr = false
                    return
                }
            })
            if (is_incr){
                if (incr_shorted_resource_priority(data.name)) {
                    console.log('last: incr resource priority: ' + data.name)
                }
                return
            }
        }
    }

    let _limited_resources = []
    for(var i in short_resource_data) {
        let data = short_resource_data[i]

        if (data.type != 'tech' && data.type != 'upgrade')continue

        let need_resource = get_still_require_resource(data['prices'])
        need_resource.forEach((res)=>{
            if (get_resource_maxvalue(res.name) < res.val) {
                _limited_resources.push(res.name)
            }
        })
    }

    let limited_resources = Array.from(new Set(_limited_resources))
    let limited_map = {science: ['science'], culture: ['culture'], wood: ['storage'], minerals: ['storage'],
        iron: ['storage'], gold: ['storage'],
    }
    //用is_finish控制每次只有一个提升
    let is_finish = false
    limited_resources.forEach((res_name)=>{
        if (is_finish)return
        for(var key in limited_map) {
            if (res_name != key) continue
            limited_map[key].forEach((group_type)=>{
                if (is_finish)return
                upgrade_building_group(group_type)
                let buildings = get_building_groups(group_type)
                for(var i=buildings.length-1;i>=0;i--){
                    let bld_name = buildings[i]
                    if (is_build_resource_limited(bld_name))continue
                    if (incr_shorted_resource_priority(bld_name, 'building')) {
                        console.log('last: incr resource priority: ' + bld_name + ' - ' + res_name)
                        is_finish = true
                        break
                    }
                }
            })
        }
    })

    if (!has_priority_resource()){

    }
}


function scan_and_incr_shorted_resource_priority(log_flag, real_simple_resource,
                                                 is_exclude_limited=false, is_open_building=false){
    for(var i in short_resource_data){
        let data = short_resource_data[i]
        let need_resource = get_still_require_resource(data['prices'])
        if (need_resource.length <= 0)continue //已经有足够资源则无需升级

        let is_incr = true
        for (var j=0; j<need_resource.length; j++){
            if (real_simple_resource.indexOf(need_resource[j].name) < 0) {
                is_incr = false
                break
            }

            if (!is_exclude_limited){
                if (get_resource_maxvalue(need_resource[j].name) < need_resource[j].val){
                   is_incr = false
                   break
                }
            }
        }

        let is_building_check = true
        if (!is_open_building){
            is_building_check = data.type == 'tech' || data.type == 'upgrade' || data.type  == 'craft'
        }

        if (is_incr && is_building_check && data.priority <= common_priority) {
            if(incr_shorted_resource_priority(data.name, data.type)){
                console.log(log_flag + ': incr resource priority: ' + data.name + " - " + data.type)
                break
            }
        }
    }
}

function clear_short_resource_data(){
    short_resource_data = []
}