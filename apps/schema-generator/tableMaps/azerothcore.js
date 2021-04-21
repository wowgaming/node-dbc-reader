/**
 * 
 * @returns {{[key:string]:string}}
 */
function getTableMap() {
  const tables = [
    "achievement_category_dbc",
    "achievement_criteria_dbc",
    "achievement_dbc",
    "areagroup_dbc",
    "areapoi_dbc",
    "areatable_dbc",
    "auctionhouse_dbc",
    "bankbagslotprices_dbc",
    "barbershopstyle_dbc",
    "battlemasterlist_dbc",
    "charstartoutfit_dbc",
    "chartitles_dbc",
    "chatchannels_dbc",
    "chrclasses_dbc",
    "chrraces_dbc",
    "cinematiccamera_dbc",
    "cinematicsequences_dbc",
    "creaturedisplayinfo_dbc",
    "creaturefamily_dbc",
    "creaturemodeldata_dbc",
    "creaturespelldata_dbc",
    "creaturetype_dbc",
    "currencytypes_dbc",
    "destructiblemodeldata_dbc",
    "dungeonencounter_dbc",
    "durabilitycosts_dbc",
    "durabilityquality_dbc",
    "emotes_dbc",
    "emotestext_dbc",
    "faction_dbc",
    "factiontemplate_dbc",
    "gameobjectdisplayinfo_dbc",
    "gemproperties_dbc",
    "glyphproperties_dbc",
    "glyphslot_dbc",
    "gtbarbershopcostbase_dbc",
    "gtchancetomeleecrit_dbc",
    "gtchancetomeleecritbase_dbc",
    "gtchancetospellcrit_dbc",
    "gtchancetospellcritbase_dbc",
    "gtcombatratings_dbc",
    "gtnpcmanacostscaler_dbc",
    "gtoctclasscombatratingscalar_dbc",
    "gtoctregenhp_dbc",
    "gtregenhpperspt_dbc",
    "gtregenmpperspt_dbc",
    "holidays_dbc",
    "itembagfamily_dbc",
    "itemdisplayinfo_dbc",
    "itemextendedcost_dbc",
    "itemlimitcategory_dbc",
    "itemrandomproperties_dbc",
    "itemrandomsuffix_dbc",
    "itemset_dbc",
    "lfgdungeons_dbc",
    "light_dbc",
    "liquidtype_dbc",
    "lock_dbc",
    "mailtemplate_dbc",
    "map_dbc",
    "mapdifficulty_dbc",
    "movie_dbc",
    "overridespelldata_dbc",
    "powerdisplay_dbc",
    "pvpdifficulty_dbc",
    "questfactionreward_dbc",
    "questsort_dbc",
    "questxp_dbc",
    "randproppoints_dbc",
    "scalingstatdistribution_dbc",
    "scalingstatvalues_dbc",
    "skillline_dbc",
    "skilllineability_dbc",
    "soundentries_dbc",
    "spell_dbc",
    "spellcasttimes_dbc",
    "spellcategory_dbc",
    "spelldifficulty_dbc",
    "spellduration_dbc",
    "spellfocusobject_dbc",
    "spellitemenchantment_dbc",
    "spellitemenchantmentcondition_dbc",
    "spellradius_dbc",
    "spellrange_dbc",
    "spellrunecost_dbc",
    "spellshapeshiftform_dbc",
    "stableslotprices_dbc",
    "summonproperties_dbc",
    "talent_dbc",
    "talenttab_dbc",
    "taxinodes_dbc",
    "taxipath_dbc",
    "taxipathnode_dbc",
    "teamcontributionpoints_dbc",
    "totemcategory_dbc",
    "transportanimation_dbc",
    "transportrotation_dbc",
    "vehicle_dbc",
    "vehicleseat_dbc",
    "wmoareatable_dbc",
    "worldmaparea_dbc",
    "worldmapoverlay_dbc"
  ];

  const tableMap = {}
  tables.forEach(t => { tableMap[t] = t.replace("_dbc", '') })
  return tableMap;
}


function toPascalCase(string) {
  return `${string}`
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w+)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), s => s.toUpperCase());
}


module.exports = {
  getTableMap
}
