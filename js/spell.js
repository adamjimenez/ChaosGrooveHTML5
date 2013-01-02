var MAX_PIECES = 999;
var MAX_WIZ_SPELLS = 256;
var MAX_POS_SPELLS = 999;

var total_spells={};
total_spells.num=spells.length;
total_spells.loaded_spell_list_name; 

var spell_list = {};
var spell = {};

var spell_icon_gfx = [];

function load_spells() {
	var s, frames, gfx, piece_num, data, num;

	var name;
	var file;
	var text;

	console.log("Reading in all available Spell ID's..");

	/*
	num = spell_icon_gfx.size();

	if (num > 0) {
		console.log("Destroying %d old spell icon gfx..", num);

		for (s = 0; s < num; s++) {
			spell_icon_gfx[s].freePicture();
		}

		spell_icon_gfx.clear(); // Remove old vectors.
	}*/

	// Read spells from data file

	// Find current spell list to load from
	var vars = find_option_choice_variables(CONFIG_OPTIONS, "SPELL", "SPELL LIST", null, null, null, name);
	name = vars[3];

	total_spells.loaded_spell_list_name = sprintf("%s", name);
	text = sprintf("Spells\\%s.ini", name);
	//file = sprintf("%s", KMiscTools.makeFilePath(text));

	//set_config_file_new(CONFIG_TEMP, file, true);

	total_spells.num = 0;
	gfx = 0;

	for (s = 0; s < spells.length; s++) {
		name = sprintf("SPELL_%d", s);

		//GetConfigString(CONFIG_TEMP, name, "NAME", text, MAX_STRING);
		text = spells[total_spells.num].name;
		
		if (strcmp(text, "") == 0) continue; // No Spell here.

		// We don't use the FIELD ID, but our own total_spells.num
		// This lets us have gaps in the ID sequence and makes it more easy to cut and paste
		// spells from different data files.

		spell[total_spells.num]={};

		spell[total_spells.num].name = sprintf("%s", text);

		// New piece name?
		//GetConfigString(CONFIG_TEMP, name, "NEW_PIECE_NAME", text, MAX_STRING);
		text = spells[total_spells.num].new_piece_name;
		
		if (strcmp(text, "") == 0) {
			spell[total_spells.num].piece_name = sprintf("%s", spell[total_spells.num].name);
		} else {
			spell[total_spells.num].piece_name = sprintf("%s", text);
		}

		//GetConfigString(CONFIG_TEMP, name, "DESC", spell[total_spells.num].desc, MAX_STRING);
		spell[total_spells.num].desc = spells[total_spells.num].desc;
		
		//spell[total_spells.num].desc=strip_underscores_from_text(spell[total_spells.num].desc);

		spell[total_spells.num].piece_ID = -1;

		// Does this spell create a new piece?
		//spell[total_spells.num].create_piece = GetConfigYes(CONFIG_TEMP, name, "CREATE_PIECE", false);
		spell[total_spells.num].create_piece = spells[total_spells.num].create_piece;		
		
		//spell[total_spells.num].on_kill_create_piece = GetConfigYes(CONFIG_TEMP, name, "CREATE_ON_KILL_PIECE", false);
		spell[total_spells.num].on_kill_create_piece = spells[total_spells.num].create_on_kill_piece;

		// Try to load spell icon.
		text = sprintf("Spells\\%s\\Groove\\", spell[total_spells.num].name);
		//file = sprintf("%s", KMiscTools.makeFilePath(text));

		if( find_piece_by_name(spell[total_spells.num].name)==-1 ){
			frames = LoadAndAddBitmaps(spell_icon_gfx, 1, 'Spells/'+spell[total_spells.num].name+'/Groove/');
		}else{
			frames = 0;	
		}

		if (frames > 0) {
			spell[total_spells.num].gfx = gfx;
			gfx += frames;
		} else {
			// Ok, we couldn't find a spell icon gfx, so lets see if we have a piece gfx with the same spell name we should use.
			data = find_piece_by_name(spell[total_spells.num].name);
			spell[total_spells.num].piece_ID = data;
			if (data > -1) data = piece[data].gfx;

			spell[total_spells.num].gfx = data;
		}

		// Cast effect?
		//GetConfigString(CONFIG_TEMP, name, "CAST_EFFECT", text, MAX_STRING);		
		text = spells[total_spells.num].cast_effect;
		
		spell[total_spells.num].cast_effect = find_effect_by_name(text, EFFECT_SPELLCAST);
		
		//spell[total_spells.num].cast_effect_var1 = GetConfigInt(CONFIG_TEMP, name, "CAST_EFFECT_VAR1", 96);
		spell[total_spells.num].cast_effect_var1 = spells[total_spells.num].cast_effect_var1;
		
		//spell[total_spells.num].cast_effect_var2 = GetConfigInt(CONFIG_TEMP, name, "CAST_EFFECT_VAR2", 1);
		spell[total_spells.num].cast_effect_var2 = spells[total_spells.num].cast_effect_var2;

		// Missile gfx.. (magic stars (47), is the default)
		//spell[total_spells.num].missile_gfx = GetConfigInt(CONFIG_TEMP, name, "MISSILE_GFX", 47);
		
		if( spells[total_spells.num].missile_gfx ){
			spell[total_spells.num].missile_gfx = spells[total_spells.num].missile_gfx;
		}else{
			spell[total_spells.num].missile_gfx = 47;
		}
		
		//spell[total_spells.num].missile_speed = GetConfigInt(CONFIG_TEMP, name, "MISSILE_SPEED", 4.0);
		spell[total_spells.num].missile_speed = spells[total_spells.num].missile_speed;

		// Attack value?
		//spell[total_spells.num].attack_value = GetConfigInt(CONFIG_TEMP, name, "ATTACK_VALUE", 0);
		spell[total_spells.num].attack_value = spells[total_spells.num].attack_value;

		// Show piece stats?
		spell[total_spells.num].show_piece_stats = false; // False for non-piece spells is the default.

		// If spell creates a piece then showing the piece stats when over this spell icon is the default instead.
		if (spell[total_spells.num].create_piece) {
			//spell[total_spells.num].show_piece_stats = GetConfigYes(CONFIG_TEMP, name, "SHOW_PIECE_STATS", true);
			spell[total_spells.num].show_piece_stats = spells[total_spells.num].show_piece_stats;
		}

		// Spell Range.
		//spell[total_spells.num].range = GetConfigInt(CONFIG_TEMP, name, "RANGE", 1);
		spell[total_spells.num].range = spells[total_spells.num].range ? spells[total_spells.num].range : 1;

		// Spell Chance.
		//spell[total_spells.num].chance = GetConfigInt(CONFIG_TEMP, name, "CHANCE", 100);
		spell[total_spells.num].chance = spells[total_spells.num].chance;

		// Spell Balance.
		//spell[total_spells.num].balance = GetConfigInt(CONFIG_TEMP, name, "BALANCE", 0);
		spell[total_spells.num].balance = spells[total_spells.num].balance;

		// Number of Casts.
		//spell[total_spells.num].casts = GetConfigInt(CONFIG_TEMP, name, "CASTS", 1);
		spell[total_spells.num].casts = spells[total_spells.num].casts;

		// Autocast?
		//spell[total_spells.num].autocast = GetConfigYes(CONFIG_TEMP, name, "AUTOCAST", false);
		spell[total_spells.num].autocast = spells[total_spells.num].autocast;

		// Kill Growths?
		//spell[total_spells.num].kill_growths = GetConfigYes(CONFIG_TEMP, name, "KILL_GROWTHS", false);
		spell[total_spells.num].kill_growths = spells[total_spells.num].kill_growths;

		// Can be illusion?
		//spell[total_spells.num].can_be_illusion = GetConfigYes(CONFIG_TEMP, name, "CAN_BE_ILLUSION", false);
		spell[total_spells.num].can_be_illusion = spells[total_spells.num].can_be_illusion;

		// Destroy illusion?
		//spell[total_spells.num].destroy_illusion = GetConfigYes(CONFIG_TEMP, name, "DESTROY_ILLUSION", false);
		spell[total_spells.num].destroy_illusion = spells[total_spells.num].destroy_illusion;

		// Remove spell after use?
		//spell[total_spells.num].remove_spell_after_use = GetConfigYes(CONFIG_TEMP, name, "REMOVE_SPELL_AFTER_USE", true);
		spell[total_spells.num].remove_spell_after_use = spells[total_spells.num].remove_spell_after_use;

		// Swap Board? (Turmoil)
		//spell[total_spells.num].swap_board = GetConfigYes(CONFIG_TEMP, name, "SWAP_BOARD", false);
		spell[total_spells.num].swap_board = spells[total_spells.num].swap_board;

		// Move Piece? (Teleport)
		//spell[total_spells.num].move_piece = GetConfigYes(CONFIG_TEMP, name, "MOVE_PIECE", false);
		spell[total_spells.num].move_piece = spells[total_spells.num].move_piece;
		
		//spell[total_spells.num].cannot_move_after_spell = GetConfigYes(CONFIG_TEMP, name, "CANNOT_MOVE_AFTER_SPELL", false);
		spell[total_spells.num].cannot_move_after_spell = spells[total_spells.num].cannot_move_after_spell;

		// Affect enemy's movement?
		//spell[total_spells.num].target_cannot_move = GetConfigYes(CONFIG_TEMP, name, "TARGET_CANNOT_MOVE", false);
		spell[total_spells.num].target_cannot_move = spells[total_spells.num].target_cannot_move;

		// Flags which determine how spell can be cast:
		// --------------------------------------------

		// On own creatures?
		//spell[total_spells.num].own = GetConfigYes(CONFIG_TEMP, name, "OWN", false);
		if( spells[total_spells.num].own === true ){
			spell[total_spells.num].own = true;
		}else{
			spells[total_spells.num].own = false;
		}

		// On empty board squares?
		//spell[total_spells.num].empty = GetConfigYes(CONFIG_TEMP, name, "EMPTY", true);
		if( spell[total_spells.num].empty === false ){
			spell[total_spells.num].empty = false;
		}else{
			spell[total_spells.num].empty = true;
		}

		// On enemy creatures?
		//spell[total_spells.num].enemy = GetConfigYes(CONFIG_TEMP, name, "ENEMY", false);
		if( spell[total_spells.num].enemy === true ){
			spell[total_spells.num].enemy = true;
		}else{
			spell[total_spells.num].enemy = false;
		}

		// On wizards?
		//spell[total_spells.num].wizards = GetConfigYes(CONFIG_TEMP, name, "WIZARDS", true);
		if( spell[total_spells.num].wizards === false ){
			spell[total_spells.num].wizards = false;
		}else{
			spell[total_spells.num].wizards = true;
		}

		// Layer of board to affect?
		//GetConfigString(CONFIG_TEMP, name, "SPELL_LAYER", text, MAX_STRING);
		text = spells[total_spells.num].spell_layer;
		
		spell[total_spells.num].layer = find_layer_by_name(text, PIECE); // PIECE is default layer..

		// Layer of board to affect?
		//GetConfigString(CONFIG_TEMP, name, "MOVE_PIECE_TO_LAYER", text, MAX_STRING);
		text = spells[total_spells.num].move_piece_to_layer;
		
		spell[total_spells.num].move_piece_to_layer = find_layer_by_name(text, NO_LAYER);

		// Line of Sight needed?
		//spell[total_spells.num].line_of_sight = GetConfigYes(CONFIG_TEMP, name, "LINE_OF_SIGHT", true);
		if( spells[total_spells.num].line_of_sight === false ){
			spell[total_spells.num].line_of_sight = false;
		}else{
			spell[total_spells.num].line_of_sight = true;
		}

		// Subversion spell aspect?
		//spell[total_spells.num].change_owner_to_our_wizard = GetConfigYes(CONFIG_TEMP, name, "CHANGE_OWNER_TO_OUR_WIZARD", false);
		if( spells[total_spells.num].change_owner_to_our_wizard === true ){
			spell[total_spells.num].change_owner_to_our_wizard = true;
		}else{
			spell[total_spells.num].change_owner_to_our_wizard = false;
		}

		// Does spell need to beat enemy's magic resistance?
		//spell[total_spells.num].chance_against_magic_resistance = GetConfigYes(CONFIG_TEMP, name, "CHANCE_AGAINST_MAGIC_RESISTANCE", false);
		if( spells[total_spells.num].chance_against_magic_resistance === true ){
			spell[total_spells.num].chance_against_magic_resistance = true;
		}else{
			spell[total_spells.num].chance_against_magic_resistance = false;
		}

		// Does spell do a magic attack?
		//spell[total_spells.num].magic_attack = GetConfigYes(CONFIG_TEMP, name, "MAGIC_ATTACK", false);
		if( spells[total_spells.num].magic_attack === true ){
			spell[total_spells.num].magic_attack = true;
		}else{
			spell[total_spells.num].magic_attack = false;
		}

		// Change Undead Status?
		//spell[total_spells.num].change_undead_status_to = GetConfigYes(CONFIG_TEMP, name, "CHANGE_UNDEAD_STATUS_TO", - 1);
		if( spells[total_spells.num].change_undead_status_to  ){
			spell[total_spells.num].change_undead_status_to = spells[total_spells.num].change_undead_status_to;
		}else{
			spell[total_spells.num].change_undead_status_to = -1;
		}

		// Change Attack Undead Status?
		//spell[total_spells.num].change_attack_undead_to = GetConfigYes(CONFIG_TEMP, name, "CHANGE_ATTACK_UNDEAD_TO", - 1);
		if( spells[total_spells.num].change_attack_undead_to  ){
			spell[total_spells.num].change_attack_undead_to = spells[total_spells.num].change_attack_undead_to;
		}else{
			spell[total_spells.num].change_attack_undead_to = -1;
		}

		// Change Flying Status?
		//spell[total_spells.num].change_flying_to = GetConfigYes(CONFIG_TEMP, name, "CHANGE_FLYING_TO", - 1);
		if( spells[total_spells.num].change_flying_to  ){
			spell[total_spells.num].change_flying_to = spells[total_spells.num].change_flying_to;
		}else{
			spell[total_spells.num].change_flying_to = -1;
		}

		// Change Shadow Form Status?
		//spell[total_spells.num].change_shadow_form_to = GetConfigYes(CONFIG_TEMP, name, "CHANGE_SHADOW_FORM_TO", - 1);
		if( spells[total_spells.num].change_shadow_form_to  ){
			spell[total_spells.num].change_shadow_form_to = spells[total_spells.num].change_shadow_form_to;
		}else{
			spell[total_spells.num].change_shadow_form_to = -1;
		}

		// Change movement amount?
		//spell[total_spells.num].change_movement_amount_to = GetConfigInt(CONFIG_TEMP, name, "CHANGE_MOVEMENT_AMOUNT_TO", - 1);
		if( spells[total_spells.num].change_movement_amount_to  ){
			spell[total_spells.num].change_movement_amount_to = spells[total_spells.num].change_movement_amount_to;
		}else{
			spell[total_spells.num].change_movement_amount_to = -1;
		}

		// Change ranged combat attack?
		//spell[total_spells.num].change_ranged_combat_attack_to = GetConfigInt(CONFIG_TEMP, name, "CHANGE_RANGED_COMBAT_ATTACK_TO", - 1);
		if( spells[total_spells.num].change_ranged_combat_attack_to  ){
			spell[total_spells.num].change_ranged_combat_attack_to = spells[total_spells.num].change_ranged_combat_attack_to;
		}else{
			spell[total_spells.num].change_ranged_combat_attack_to = -1;
		}

		// Change ranged combat range?
		//spell[total_spells.num].change_ranged_combat_range_to = GetConfigInt(CONFIG_TEMP, name, "CHANGE_RANGED_COMBAT_RANGE_TO", - 1);
		if( spells[total_spells.num].change_ranged_combat_range_to  ){
			spell[total_spells.num].change_ranged_combat_range_to = spells[total_spells.num].change_ranged_combat_range_to;
		}else{
			spell[total_spells.num].change_ranged_combat_range_to = -1;
		}
		
		

		// Change gfx to?
		//GetConfigString(CONFIG_TEMP, name, "CHANGE_GFX_TO", text, MAX_STRING);
		text = spells[total_spells.num].change_gfx_to;		
		
		spell[total_spells.num].change_gfx_to = -1;
		if (strlen(text) > 0) spell[total_spells.num].change_gfx_to = find_piece_by_name(text);

		// Change piece to? We store the name as a text string here so we can also use groups for random changes..
		//GetConfigString(CONFIG_TEMP, name, "CHANGE_PIECE_TO", spell[total_spells.num].new_piece_name, 40);
		spell[total_spells.num].new_piece_name = spells[total_spells.num].change_piece_to;

		// Add to Defence & Combat.
		//spell[total_spells.num].add_to_defence = GetConfigInt(CONFIG_TEMP, name, "ADD_TO_DEFENCE", 0);
		spell[total_spells.num].add_to_defence = spells[total_spells.num].add_to_defence;
		
		//spell[total_spells.num].add_to_combat = GetConfigInt(CONFIG_TEMP, name, "ADD_TO_COMBAT", 0);
		spell[total_spells.num].add_to_combat = spells[total_spells.num].add_to_combat;

		//console.log("name: %s, text: %s, change: %d", spell[total_spells.num].name, text, spell[total_spells.num].change_gfx_to);
		//console.log("name: %s, undead: %d, attack: %d", spell[total_spells.num].name, 
		//spell[total_spells.num].change_undead_status_to, spell[total_spells.num].change_attack_undead_to);

		// Log details:
		//console.log("Spell: %d, ID: %d, Name: %s, Chance: %d", total_spells.num, spell[total_spells.num].piece_ID, text,
		//spell[total_spells.num].chance);

		total_spells.num++;
	}

	console.log("Found %d spells.", total_spells.num);
}

function setup_spell_lists() {
	var w, s, amount, min_spells, max_spells;

	// Setup random spell lists for all wizards.
	// - incorporate chances for spells appearing in list for possible option in future?

	if (total_spells.num < 1) return; // Error!

	var vars = find_option_choice_variables(CONFIG_OPTIONS, "SPELL", "NUMBER OF SPELLS", min_spells, max_spells, null, null);
	min_spells = vars[0];
	max_spells = vars[1];

	for (w = 0; w < MAX_WIZARDS; w++) {
		for (s = 0; s < MAX_WIZ_SPELLS; s++) {
			if( !spell_list[s] ){
				spell_list[s]={};
			}
			if( !spell_list[s][w] ){
				spell_list[s][w]={};
			}
			
			spell_list[s][w].alpha = {};
			
			spell_list[s][w].spell = -1;
		}

		amount = IRand(min_spells, max_spells);

		// If we want Illusions in the game, then add Disbelieve spell..
		if (check_option_choice(CONFIG_OPTIONS, "GAME", "ILLUSIONS", "YES")) {
			spell_list[0][w].spell = 0; // Disbelieve
			spell_list[0][w].bonus = false;
			spell_list[0][w].alpha.target = 1.0;
			spell_list[0][w].alpha.speed = 0.01;
			spell_list[0][w].alpha.current = 0.0;

			add_spells(amount - 1, w);
		} else {
			add_spells(amount, w);
		}

		sort_spell_list(w);
	}
}

function add_spells(sp, w) {
	var s, num;

	num = 0;

	for (s = 0; s < panel.spell_icon_amount; s++) {
		if (spell_list[s][w].spell == -1 && sp > 0) {
			spell_list[s][w].spell = rand() % (total_spells.num - 1) + 1;
			spell_list[s][w].bonus = true;
			spell_list[s][w].alpha.target = 1.0;
			spell_list[s][w].alpha.speed = 0.01;
			spell_list[s][w].alpha.current = 0.0;

			num++;
			sp--;
		}
	}
	return num; // Number of spells we had space to add
}

function clear_bonus_spell_stat_in_spell_list(w) {
	var s;

	for (s = 0; s < MAX_WIZ_SPELLS; s++) {
		spell_list[s][w].bonus = false;
	}
}

function sort_spell_list(w) {
	var sp={};
	var s, pos, chance;

	// Copy spells.
	for (s = 0; s < panel.spell_icon_amount; s++) {		
		sp[s] = spell_list[s][w].spell;
	}

	pos = 0;

	// Sort spells by A-Z
	/*
	for (chance = 65; chance < 91; chance++) {
		for (s = 0; s < panel.spell_icon_amount; s++) {
			if (sp[s] == -1) continue; // Already picked.

			// Is first letter the same (either uppercase or lowercase?)
			if (spell[sp[s]].name[0] == chance || spell[sp[s]].name[0] == chance + 32) {
				spell_list[pos][w].spell = sp[s];
				sp[s] = -1;
				pos++;
			}
		}
	}*/

	// Now copy a-z sorted spells ready for ordering by chance.
	for (s = 0; s < panel.spell_icon_amount; s++) {
		sp[s] = spell_list[s][w].spell;
	}

	pos = 0;

	// Now sort spells by chance. 100% first, 10% last. Count down from 100 to 0 to deal with cases like 95%, 82%, etc..
	for (chance = 100; chance > 0; chance--) {
		for (s = 0; s < panel.spell_icon_amount; s++) {
			if (sp[s] == -1) continue; // Already picked.

			if (spell[sp[s]].chance == chance) {
				spell_list[pos][w].spell = sp[s];
				sp[s] = -1;
				pos++;
			}
		}
	}
}

function check_if_can_cast_all_spells(wiz) {
	var s, total;

	for (s = 0; s < MAX_WIZ_SPELLS; s++) {
		if (spell_list[s][wiz].spell == -1) continue;

		spell_list[s][wiz].cast = true;
		total = highlight_where_spell_can_be_cast(spell_list[s][wiz].spell, true);

		if (total == 0) spell_list[s][wiz].cast = false;

		//console.log("name : %s, cast : %d, total : %d", spell[spell_list[s][wiz].spell].name, spell_list[s][wiz].cast, total);
	}
}

function select_spell(s) {
	var sp;

	// Store actual spell ID (NOT spell list position), ready for the spell casting phase
	// The spell ID number in the list is set to -1 to mark the spell as already used.
	// - replace -1 with a define name?

	if (s == NO_SPELL) {
		// Don't erase old spell, but set Wizard as having NO SPELL.
		wizard[game.current_wizard].spell = -1;
		return;
	}

	sp = spell_list[s][game.current_wizard].spell;
	if (spell[sp].remove_spell_after_use) spell_list[s][game.current_wizard].spell = -1;

	wizard[game.current_wizard].spell = sp;
	wizard[game.current_wizard].spell_is_illusion = mouse.spell_is_illusion;

	panel.info_area_alpha.target = 0.0; // Fade out details..
	mouse.over_spell_icon = -1;
}

function can_we_cast_spell_here(x, y) {
	// Does all checks to see if we can cast spell at a map location.
	// This is made super simple due to our highlight board array.

	if (highlight_board[x][y].type == HIGHLIGHT_NONE) return false;
	if (highlight_board[x][y].type == HIGHLIGHT_ENEMY) return false;
	if (highlight_board[x][y].type == HIGHLIGHT_OUR_PIECE) return false;
	if (highlight_board[x][y].type == HIGHLIGHT_OUR_PIECE_MOVED) return false;

	// Spell can be cast here.
	return true;
}

function return_spell_chance(sp) {
	var chance, x;

	chance = spell[sp].chance + wizard[game.current_wizard].ability;

	if (game.balance > 0 && spell[sp].balance > 0) // Lawchance = chance + ((game.balance / 4) * 10);

	if (game.balance < 0 && spell[sp].balance < 0) // Chaoschance = chance + ((-(game.balance) / 4) * 10);

	var vars = find_option_choice_variables(CONFIG_OPTIONS, "SPELL", "SPELLS INCREASE BY 10% EVERY X TURNS", x, null, null, null);

	//x = vars[0];
	x = 0;
	
	if (x > 0) chance = chance + (((game.turn - 1) / x) * 10);

	if (chance > 100) chance = 100; // No more than 100%

	return chance;
}

function try_to_cast_spell(x, y) {
	var r, chance, sp, owner, g, snd;
	var name;

	board_info.highlight_alpha.target = 0;
	clear_highlight_board();
	sp = wizard[game.current_wizard].spell;
	snd = -1;

	if (game.debug_to_chat) {
		name = sprintf("Wizard casting spell : %s - x: %d, y: %d", spell[sp].name, x, y);
		add_chat_line(name, wizard[game.current_wizard].col);
	}

	//console.log("* spell: %d, illusion: %d", sp, wizard[game.current_wizard].spell_is_illusion);
	if (!spell[wizard[game.current_wizard].spell].autocast) snd = request_sound_effect(spell[sp].name, "SPELL", "CAST", false);

	if (spell[sp].move_piece) {
		do_effect(spell[sp].cast_effect, board_info.selected_x, board_info.selected_y, spell[sp].cast_effect_var1, spell[sp].cast_effect_var2);
		g = board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].gfx;
		board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].gfx = -1;
	}

	if (spell[sp].range != 0 && spell[sp].missile_gfx != -1) {
		// Do spell beam effect.
		do_missile_effect(spell[sp].missile_gfx, spell[sp].missile_speed, board_info.selected_x, board_info.selected_y, x, y);
	}

	if (spell[sp].cast_effect != EFFECT_NONE) {
		// Now do casting effect.
		do_effect(spell[sp].cast_effect, x, y, spell[sp].cast_effect_var1, spell[sp].cast_effect_var2);
		wait_time(spell[sp].cast_effect_var1);
	} else {
		wait_time(20);
	}


	r = 0;
	if (!game.done_spell_chance) r = parseInt(rand(0,1) % 100);
	chance = return_spell_chance(sp);
	if (wizard[game.current_wizard].spell_is_illusion) r = 0; // Illusions always work!

	if (r <= chance) {
		// Ok, spell succeeded, but does it need to beat magic resistance of a target?
		if (spell[sp].chance_against_magic_resistance) {
			// Yes, so final check is to see if we can beat creatures magic resistance!
			r = Rand() % 10;
			chance = 10 - board[x][y][PIECE].magic_resist;
		}
	}

	// Spell fails?
	if (r > chance) {
		wait_time(150);
		//console.log("spell: %s failed!", spell[sp].name);
		//goto spell_fails;
	}

	game.done_spell_chance = true;

	// Spell logic..
	if (spell[sp].kill_growths) {
		//console.log("Killing growths!");
		kill_growths();
		wait_time(150);
	}

	if (spell[sp].move_piece_to_layer != NO_LAYER) {
		r = find_piece_by_name(board[x][y][spell[sp].layer].name);

		if (r != -1) {
			// Used for raise dead and other possible effects (like uncovering from gooey blob)
			board[x][y][spell[sp].move_piece_to_layer] = board[x][y][spell[sp].layer];
			board[x][y][spell[sp].layer].gfx = BLANK;

			// Restore gfx (if this was a body)
			board[x][y][spell[sp].move_piece_to_layer].start_gfx = piece[r].start_gfx;
			board[x][y][spell[sp].move_piece_to_layer].gfx = piece[r].gfx;
			board[x][y][spell[sp].move_piece_to_layer].gfx_frames = piece[r].gfx_frames;

			if (spell[sp].layer == BODY) {
				board[x][y][spell[sp].move_piece_to_layer].dead = false; // Back from the dead!
				board[x][y][spell[sp].move_piece_to_layer].disbelieved = true; // This can't be an illusion!
				board[x][y][spell[sp].move_piece_to_layer].has_moved = false;
				board[x][y][spell[sp].move_piece_to_layer].has_attacked = false;
				if (board[x][y][spell[sp].move_piece_to_layer].ranged_combat_range > 0) board[x][y][spell[sp].move_piece_to_layer].has_shot = false;
			}
			board_info.selected_layer = spell[sp].move_piece_to_layer;

			wait_time(50);
		}
	}

	if (spell[sp].create_piece) {
		// Create new piece!
		create_new_piece(spell[sp].piece_name, x, y);
		board[x][y][PIECE].chance = return_spell_chance(sp);
		board[x][y][PIECE].can_be_illusion = spell[sp].can_be_illusion;

		wait_time(50);
	}

	if (spell[sp].move_piece) {
		move_piece(x, y);
		board[x][y][board_info.selected_layer].gfx = g;
	}


	if (spell[sp].change_undead_status_to != -1) board[x][y][board_info.selected_layer].undead = spell[sp].change_undead_status_to;
	if (spell[sp].change_attack_undead_to != -1) board[x][y][board_info.selected_layer].can_attack_undead = spell[sp].change_attack_undead_to;

	if (spell[sp].change_owner_to_our_wizard) board[x][y][board_info.selected_layer].owner = game.current_wizard;

	// Flying & movement..
	if (spell[sp].change_flying_to != -1) board[x][y][board_info.selected_layer].flying = spell[sp].change_flying_to;
	if (spell[sp].change_movement_amount_to != -1) board[x][y][board_info.selected_layer].movement = spell[sp].change_movement_amount_to;

	// Shadow Form..
	if (spell[sp].change_shadow_form_to != -1) board[x][y][board_info.selected_layer].shadow_form = spell[sp].change_shadow_form_to;

	// Ranged combat..
	if (spell[sp].change_ranged_combat_attack_to != -1) {
		board[x][y][board_info.selected_layer].ranged_combat_attack = spell[sp].change_ranged_combat_attack_to;
		board[x][y][board_info.selected_layer].has_shot = false; // Allow us to now shoot this turn..
	}

	if (spell[sp].change_ranged_combat_range_to != -1) board[x][y][board_info.selected_layer].ranged_combat_range = spell[sp].change_ranged_combat_range_to;

	// Need to change gfx?
	if (spell[sp].change_gfx_to != -1) {
		board[x][y][board_info.selected_layer].gfx = piece[spell[sp].change_gfx_to].gfx;
		board[x][y][board_info.selected_layer].body_gfx = piece[spell[sp].change_gfx_to].body_gfx;
		board[x][y][board_info.selected_layer].gfx_frames = piece[spell[sp].change_gfx_to].gfx_frames;
		board[x][y][board_info.selected_layer].ping_pong_anim = piece[spell[sp].change_gfx_to].ping_pong_anim;
		board[x][y][board_info.selected_layer].ping_pong_anim_forward = piece[spell[sp].change_gfx_to].ping_pong_anim_forward;
		board[x][y][board_info.selected_layer].start_gfx = piece[spell[sp].change_gfx_to].start_gfx;
		board[x][y][board_info.selected_layer].time_between_frames = piece[spell[sp].change_gfx_to].time_between_frames;
		board[x][y][board_info.selected_layer].time_next_frame = piece[spell[sp].change_gfx_to].time_next_frame;
	}

	// Does spell change piece?
	if (strlen(spell[sp].new_piece_name) > 0) {
		wait_time(25);


		r = find_piece_by_name(spell[sp].new_piece_name);
		if (r != -1) {
			owner = board[x][y][PIECE].owner;
			board[x][y][PIECE] = piece[r];
			board[x][y][PIECE].owner = owner;
		} else {
			// Maybe this is a group then?
			r = pick_random_piece_by_group_name(spell[sp].new_piece_name);

			// Did we find a creature?
			if (r != -1) {
				owner = board[x][y][PIECE].owner;
				board[x][y][PIECE] = piece[r];
				board[x][y][PIECE].owner = owner;
			}
		}
	}

	// Need to add to stats?
	if (spell[sp].add_to_defence) {
		// These spells are not cumulative, so each one replaces the previous value. To do this we need to find the original
		// piece and refer to the original stat.
		r = find_piece_by_name(board[x][y][board_info.selected_layer].name);
		board[x][y][board_info.selected_layer].defence = MIN(piece[r].defence + spell[sp].add_to_defence, 9);
	}
	if (spell[sp].add_to_combat) {
		// These spells are not cumulative, so each one replaces the previous value. To do this we need to find the original
		// piece and refer to the original stat.
		r = find_piece_by_name(board[x][y][board_info.selected_layer].name);
		board[x][y][board_info.selected_layer].combat = MIN(piece[r].combat + spell[sp].add_to_combat, 9);
	}

	if (spell[sp].attack_value > 0) {
		wait_time(5);

		// Have we killed enemy piece?
		if (do_attack_calculation(spell[sp].attack_value, board[x][y][PIECE].defence)) {
			kill_piece(x, y, game.current_wizard, true);
			request_sound_effect("creature", "creature", "KILLED BY MAGIC MISSILE", true);

			if (spell[sp].on_kill_create_piece) {
				wait_time(50);

				// Create new piece!
				create_new_piece(spell[sp].piece_name, x, y);
				board[x][y][PIECE].chance = return_spell_chance(sp);
				board[x][y][PIECE].can_be_illusion = spell[sp].can_be_illusion;

				wait_time(50);
			}
		} else {
			// goto spell_fails;
		}
	}

	if (spell[sp].magic_attack) {
		wait_time(200);

		// Final check is to see if we can beat creatures magic resistance!
		r = Rand() % 10;
		chance = board[x][y][PIECE].magic_resist;

		if (r > chance) {
			r = find_current_option_choice(CONFIG_OPTIONS, "GAME", "MAGIC ATTACK ON WIZARD");

			// Unmounted wizard here..
			if (wizard_here(x, y) != -1 && board[x][y][MOUNTED].gfx == -1) {
				if (r == 1) kill_wizards_creatures(wizard_here(x, y), false); // Kill strongest creature
				if (r == 2) kill_wizards_creatures(wizard_here(x, y), true); // Kill all creatures
			}

			if (wizard_here(x, y) == -1 || (wizard_here(x, y) != -1 && board[x][y][MOUNTED].gfx != -1)) {
				wait_time(15);
				do_effect(EFFECT_EXPLODE, x, y, 64, 1);
				kill_piece(x, y, game.current_wizard, true);
				request_sound_effect(spell[sp].name, "SPELL", "KILLS_CREATURE", false);

				if (spell[sp].on_kill_create_piece) {
					wait_time(50);

					// Create new piece!
					create_new_piece(spell[sp].piece_name, x, y);
					board[x][y][PIECE].chance = return_spell_chance(sp);
					board[x][y][PIECE].can_be_illusion = spell[sp].can_be_illusion;

					wait_time(50);
				}
			}
		}
	}
	if (spell[sp].destroy_illusion) {
		if (board[x][y][PIECE].illusion) {
			wait_time(15);
			do_effect(EFFECT_EXPLODE, x, y, 64, 1);
			request_sound_effect(board[x][y][PIECE].name, "CREATURE", "ILLUSION_DISBELIEVED", false);
			kill_piece(x, y, game.current_wizard, false);
			wait_time(200);
		} else {
			board[x][y][PIECE].disbelieved = true;
			// goto spell_fails;
		}
	}


	// Abort wizards movement after spell if requested.
	if (spell[sp].cannot_move_after_spell) {
		board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_moved = true;
		board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_attacked = true;
		board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_shot = true;
	}

	// Stop targets movement after spell if requested.
	if (spell[sp].target_cannot_move) {
		board[x][y][PIECE].has_moved = true;
		board[x][y][PIECE].has_attacked = true;
		board[x][y][PIECE].has_shot = true;
	}

	return true;

	spell_fails:

	return false; // Spell failed!
}

function spell_succeeds() {
	wait_time(10);

	panel.info_area_line[1] = sprintf("SPELL SUCCEEDS");
	panel.info_area_line_rgba[1] = Rgba(0.0, 1.0, 0.0);
	request_sound_effect(spell[wizard[game.current_wizard].spell].name, "SPELL", "SUCCEEDS", true);

	// Alter law/chaos balance
	game.balance += spell[wizard[game.current_wizard].spell].balance;
}

function spell_fails() {
	wait_time(10);

	panel.info_area_line[1] = sprintf("SPELL FAILS");
	panel.info_area_line_rgba[1] = Rgba(1.0, 0.0, 0.0);
	request_sound_effect(spell[wizard[game.current_wizard].spell].name, "SPELL", "FAILS", true);
}

function return_spell_chance_col(chance) {
	chance = chance / 10;

	if (chance == 1) return Rgba(1.0, 0.0, 0.0);
	if (chance == 2) return Rgba(0.5, 0.5, 0.5);
	if (chance == 3) return Rgba(0.0, 0.0, 0.5);
	if (chance == 4) return Rgba(0.0, 0.5, 0.0);
	if (chance == 5) return Rgba(0.0, 0.5, 1.0);
	if (chance == 6) return Rgba(0.0, 1.0, 0.0);
	if (chance == 7) return Rgba(0.0, 1.0, 1.0);
	if (chance == 8) return Rgba(1.0, 0.5, 0.0);
	if (chance == 9) return Rgba(1.0, 1.0, 0.0);
	if (chance == 10) return Rgba(1.0, 1.0, 1.0);

	return Rgba(0.0, 0.0, 0.0);
}

function highlight_where_spell_can_be_cast(s, clear) {
	var x, y, w, total;

	var text = "";

	if (s < 0) return 0;

	if (spell[s].piece_ID != -1) {
		text = sprintf("%s", piece[spell[s].piece_ID].group_name);
	}

	total = set_highlight_board(wizard[game.current_wizard].x, wizard[game.current_wizard].y,
	spell[s].range, spell[s].layer, spell[s].own, spell[s].empty, spell[s].enemy, spell[s].line_of_sight, clear,
	text);

	//console.log("spell : %s, total : %d", spell[s].name, total);

	// Now we have to alter some parts of the highlight for some specific spell attributes.
	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			w = wizard_here(x, y);

			// Can this spell be cast on wizards?
			if (w != -1 && !spell[s].wizards) {
				if (highlight_board[x][y].type != HIGHLIGHT_NONE) {
					set_board_highlight(HIGHLIGHT_NONE, x, y);
					total--;
					continue;
				}
			}

			// Does this spell destroy illusions, but current piece has already been disbelieved (hence real)?
			if (spell[s].destroy_illusion && (board[x][y][PIECE].disbelieved || !board[x][y][PIECE].can_be_illusion || board[x][y][PIECE].chance == 100)) {
				if (highlight_board[x][y].type != HIGHLIGHT_NONE) {
					set_board_highlight(HIGHLIGHT_NONE, x, y);
					total--;
					continue;
				}
			}

			if (board[x][y][PIECE].gfx != -1) {
				// Does the spell 'roll' against magic resistance?
				if (spell[s].chance_against_magic_resistance || spell[s].magic_attack) {
					// Piece CANNOT be hurt by magic attack..
					if (board[x][y][PIECE].magic_resist == 0) {
						if (highlight_board[x][y].type != HIGHLIGHT_NONE) {
							set_board_highlight(HIGHLIGHT_NONE, x, y);
							total--;
						}
					}
				}
			}
		}
	}

	return total;
}

function autocast_spell(best_x, best_y) {
	var x, y;
	var dist, best_dist;

	request_sound_effect(spell[wizard[game.current_wizard].spell].name, "SPELL", "CAST", false);

	// Used for Turmoil
	if (spell[wizard[game.current_wizard].spell].swap_board) {
		swap_all_board();
		return;
	}

	// Used for Magic Wood
	highlight_where_spell_can_be_cast(wizard[game.current_wizard].spell, true);
	hide_highlight_board(true);

	// Reset best values
	best_dist = 1000.0;
	best_x = -1;
	best_y = -1;

	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			// How far away is this square from our wizard?
			dist = workout_range(wizard[game.current_wizard].x, wizard[game.current_wizard].y, x, y);

			// Skip any non-highlighted squares.
			if (highlight_board[x][y].type == HIGHLIGHT_NONE) continue;

			// Record details of this square if it's closer to our target.
			if (dist <= best_dist) {
				best_dist = dist;
				best_x = x;
				best_y = y;
			}
		}
	}
}

function find_layer_by_name(name, def) {
	if (strcmp(name, "BODY") == 0) return BODY;
	if (strcmp(name, "PIECE") == 0) return PIECE;
	if (strcmp(name, "MOUNTED") == 0) return MOUNTED;

	// return default
	return def;
}

function amount_of_this_spell_in_list(sp) {
	var s, num;

	num = 0;
	for (s = 0; s < MAX_WIZ_SPELLS; s++) {
		if (spell_list[s][game.current_wizard].spell == sp) num++;
	}

	return num;
}

function kill_growths() {
	var x, y, p;

	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			if (board[x][y][PIECE].gfx == -1) continue;
			if (board[x][y][PIECE].grow_chance == 0) continue;

			p = find_piece_by_name(board[x][y][PIECE].grow_piece_name);
			if (strcmp(piece[p].name, board[x][y][PIECE].name) != 0) continue;

			do_effect(EFFECT_EXPLODE, x, y, 64, 1);
			kill_piece(x, y, - 1, false);
		}
	}
}