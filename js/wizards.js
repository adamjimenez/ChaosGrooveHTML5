var MAX_WIZARDS = 8;
var INDEPENDENT = MAX_WIZARDS;

var wizard={};
for (w = 0; w <= MAX_WIZARDS; w++) {
	wizard[w]={};
}

function setup_wizards() {
	var w, c;
	var name;

	// Setup which wizards are alive for the defaults. 
	// These can then be modified in the menus.
	wizard[0].alive = true;
	wizard[1].alive = true;
	wizard[2].alive = true;
	wizard[3].alive = true;
	wizard[4].alive = false;
	wizard[5].alive = false;
	wizard[6].alive = false;
	wizard[7].alive = false;
	wizard[INDEPENDENT].alive = true;

	wizard[0].human = true;
	wizard[1].human = false;
	wizard[2].human = false;
	wizard[3].human = false;
	wizard[4].human = false;
	wizard[5].human = false;
	wizard[6].human = false;
	wizard[7].human = false;
	wizard[INDEPENDENT].human = false;

	// Don't forget Independents.
	wizard[INDEPENDENT].name = "INDEPENDENT";

	for (w = 0; w < MAX_WIZARDS; w++) {
		name = sprintf("WIZARDS_%d", w + 1);
		
		//GetConfigString(CONFIG_WIZARDS, name, "OPTION", wizard[w].name, 80); // Find name from options		
		wizard[w].name = CONFIG_WIZARDS[name].OPTION;

		//c = GetConfigInt(CONFIG_WIZARDS, name, "OPTION_CURRENT_CHOICE", - 1);		
		c = CONFIG_WIZARDS[name].OPTION_CURRENT_CHOICE;

		if (c == -1) continue;

		// Ok, set whether human and/or alive from options
		wizard[w].human = true;
		wizard[w].alive = true;

		if (c == 1) wizard[w].human = false;
		if (c == 2) wizard[w].alive = false;
	}

	setup_wizard_colours();

	game.current_wizard = 0;
}

function setup_wizard_names() {
	var w, a, b, c;
	var file, text;

	for (w = 0; w < MAX_WIZARDS; w++) {
		// For now, generate default wizard name.
		wizard[w].name = sprintf("WIZARD %d", w + 1);
	}

	for (w = 0; w < MAX_WIZARDS; w++) {
		randomise_wizard_name(w);
	}
}

function randomise_wizard_name(w) {
	var a, b, c;
	var text, name;

	memset(name, 0, MAX_STRING);

	if (w < 0 || w >= MAX_WIZARDS) return;

	var vars = find_option_choice_variables(CONFIG_WIZARDS, "WIZARDS", "WIZARD NAME LIST", null, null, null, name);
	name = vars[3];
	
	if (strlen(name) <= 0) return;

	text = sprintf("\\text_files\\wizard_names\\%s.ini", name);
	set_config_file_new(CONFIG_WIZARD_NAMES, text, false);
	if (config[CONFIG_WIZARD_NAMES].data == null) return;

	start:

	find_random_line_from_text_config(CONFIG_WIZARD_NAMES, text);

	for (b = 0; b < MAX_WIZARDS; b++) {
		// if (b != w && strcmp(text, wizard[b].name) == 0) goto start; // A duplicate names!
	}
	wizard[w].name = sprintf("%s", text);

	text = sprintf("WIZARDS_%d", w + 1);
	change_config_text(CONFIG_WIZARDS, text, "OPTION", wizard[w].name);
}

function setup_wizard_colours() {
	var r, g, b, w;
	var name;

	// Setup Colours.
	wizard[0].col = Rgba(0.0, 0.0, 1.0); // Blue
	wizard[1].col = Rgba(1.0, 0.0, 0.0); // Red
	wizard[2].col = Rgba(1.0, 1.0, 0.0); // Yellow
	wizard[3].col = Rgba(0.0, 1.0, 0.0); // Green
	wizard[4].col = Rgba(0.0, 1.0, 1.0); // Turquise
	wizard[5].col = Rgba(0.5, 0.0, 1.0); // Violet
	wizard[6].col = Rgba(1.0, 0.5, 0.0); // Orange
	wizard[7].col = Rgba(1.0, 0.0, 1.0); // Purple

	// Independent
	wizard[INDEPENDENT].col = Rgba(1.0, 1.0, 1.0); // White

	// Now read from wizard options.
	for (w = 0; w < MAX_WIZARDS; w++) {
		name = sprintf("WIZARDS_%d", w + 1);
		
		/*
		r = GetConfigInt(CONFIG_WIZARDS, name, "OPTION_R", 255);		
		g = GetConfigInt(CONFIG_WIZARDS, name, "OPTION_G", 255);
		b = GetConfigInt(CONFIG_WIZARDS, name, "OPTION_B", 255);
		*/

		r = CONFIG_WIZARDS[name].OPTION_R;
		g = CONFIG_WIZARDS[name].OPTION_G;
		b = CONFIG_WIZARDS[name].OPTION_B;

		wizard[w].col = Rgba(r, g, b);
	}
}

function setup_wizard_positions() {
	// This functions counts the number of alive players (which will be set in the main menu)
	// and then sets up relevant positions for the wizards.

	var wiz={};
	var w, a, b, p, wizards, x, y;
	var name;

	wizards = 0;

	// Store list of alive players & count total number.
	for (w = 0; w < MAX_WIZARDS; w++) {
		if (wizard[w].alive) {
			wiz[wizards] = w;
			wizards++;
		}
	}

	game.num_players = wizards;

	if (wizards == 2) {
		wizard[wiz[0]].x = 1;
		wizard[wiz[1]].x = board_info.board_width - 2;

		wizard[wiz[0]].y = board_info.board_height / 2;
		wizard[wiz[1]].y = board_info.board_height / 2;
	}

	if (wizards == 3) {
		wizard[wiz[0]].x = 1;
		wizard[wiz[1]].x = board_info.board_width / 2;
		wizard[wiz[2]].x = board_info.board_width - 2;

		wizard[wiz[0]].y = board_info.board_height - 2;
		wizard[wiz[1]].y = 1;
		wizard[wiz[2]].y = board_info.board_height - 2;
	}

	if (wizards == 4) {
		wizard[wiz[0]].x = 1;
		wizard[wiz[1]].x = board_info.board_width - 2;
		wizard[wiz[2]].x = 1;
		wizard[wiz[3]].x = board_info.board_width - 2;

		wizard[wiz[0]].y = 1;
		wizard[wiz[1]].y = 1;
		wizard[wiz[2]].y = board_info.board_height - 2;
		wizard[wiz[3]].y = board_info.board_height - 2;
	}

	if (wizards == 5) {
		wizard[wiz[0]].x = board_info.board_width / 2;
		wizard[wiz[1]].x = 0;
		wizard[wiz[2]].x = board_info.board_width - 1;
		wizard[wiz[3]].x = (board_info.board_width / 5) * 1;
		wizard[wiz[4]].x = (board_info.board_width - wizard[wiz[3]].x - 1);

		wizard[wiz[0]].y = 0;
		wizard[wiz[1]].y = (board_info.board_height / 3) * 1;
		wizard[wiz[2]].y = (board_info.board_height / 3) * 1;
		wizard[wiz[3]].y = board_info.board_height - 1;
		wizard[wiz[4]].y = board_info.board_height - 1;
	}

	if (wizards == 6) {
		wizard[wiz[0]].x = 0;
		wizard[wiz[1]].x = board_info.board_width / 2;
		wizard[wiz[2]].x = board_info.board_width - 1;
		wizard[wiz[3]].x = 0;
		wizard[wiz[4]].x = board_info.board_width / 2;
		wizard[wiz[5]].x = board_info.board_width - 1;

		wizard[wiz[0]].y = 1;
		wizard[wiz[1]].y = 1;
		wizard[wiz[2]].y = 1;
		wizard[wiz[3]].y = board_info.board_height - 2;
		wizard[wiz[4]].y = board_info.board_height - 2;
		wizard[wiz[5]].y = board_info.board_height - 2;
	}

	if (wizards == 7) {
		wizard[wiz[0]].x = 1;
		wizard[wiz[1]].x = board_info.board_width / 2;
		wizard[wiz[2]].x = board_info.board_width - 2;
		wizard[wiz[3]].x = 0;
		wizard[wiz[4]].x = board_info.board_width - 1;
		wizard[wiz[5]].x = (board_info.board_width / 6) * 2;
		wizard[wiz[6]].x = (board_info.board_width - wizard[wiz[5]].x - 1);

		wizard[wiz[0]].y = 1;
		wizard[wiz[1]].y = 0;
		wizard[wiz[2]].y = 1;
		wizard[wiz[3]].y = (board_info.board_height / 2) + 1;
		wizard[wiz[4]].y = (board_info.board_height / 2) + 1;
		wizard[wiz[5]].y = board_info.board_height - 1;
		wizard[wiz[6]].y = board_info.board_height - 1;
	}

	if (wizards == 8) {
		wizard[wiz[0]].x = 0;
		wizard[wiz[1]].x = board_info.board_width / 2;
		wizard[wiz[2]].x = board_info.board_width - 1;

		wizard[wiz[3]].x = 0;
		wizard[wiz[4]].x = board_info.board_width - 1;

		wizard[wiz[5]].x = 0;
		wizard[wiz[6]].x = board_info.board_width / 2;
		wizard[wiz[7]].x = board_info.board_width - 1;

		wizard[wiz[0]].y = 0;
		wizard[wiz[1]].y = 0;
		wizard[wiz[2]].y = 0;

		wizard[wiz[3]].y = board_info.board_height / 2;
		wizard[wiz[4]].y = board_info.board_height / 2;

		wizard[wiz[5]].y = board_info.board_height - 1;
		wizard[wiz[6]].y = board_info.board_height - 1;
		wizard[wiz[7]].y = board_info.board_height - 1;
	}

	// Semi-Random placement?
	if (check_option_choice(CONFIG_WIZARDS, "WIZARDS", "WIZARD POSITIONS", "CHAOTIC")) {
		// Blank old positions
		for (w = 0; w < MAX_WIZARDS; w++) {
			wizard[w].x = -1;
			wizard[w].y = -1;
		}

		// Now find new random position for each wizard
		for (w = 0; w < MAX_WIZARDS; w++) {
			b = 0;

			start:

			x = IRand(0, board_info.board_width - 1);
			y = IRand(0, board_info.board_height - 1);

			for (a = 0; a < MAX_WIZARDS; a++) {
				if (wizard[a].x == -1) continue;

				//if (x == wizard[a].x && y == wizard[a].y) goto start;

				b++;
				//if (workout_range(wizard[a].x, wizard[a].y, x, y) < 5.0 && b < 512) goto start;
			}

			wizard[w].x = x;
			wizard[w].y = y;
		}
	}

	// Set Combat, Defence, flex & Ability..
	for (w = 0; w < MAX_WIZARDS; w++) {
		name = sprintf("Wizard_%d", w + 1);
		p = find_piece_by_name(name);

		a = check_option_choice_int(CONFIG_OPTIONS, "WIZARD", "MINIMUM WIZARD COMBAT", 1);
		b = check_option_choice_int(CONFIG_OPTIONS, "WIZARD", "MAXIMUM WIZARD COMBAT", 1);
		piece[p].combat = IRand(a, b);

		a = check_option_choice_int(CONFIG_OPTIONS, "WIZARD", "MINIMUM WIZARD DEFENCE", 1);
		b = check_option_choice_int(CONFIG_OPTIONS, "WIZARD", "MAXIMUM WIZARD DEFENCE", 1);
		piece[p].defence = IRand(a, b);

		a = check_option_choice_int(CONFIG_OPTIONS, "WIZARD", "MINIMUM WIZARD MANOEUVRE", 1);
		b = check_option_choice_int(CONFIG_OPTIONS, "WIZARD", "MAXIMUM WIZARD MANOEUVRE", 1);
		piece[p].flex = IRand(a, b);

		a = check_option_choice_int(CONFIG_OPTIONS, "WIZARD", "MINIMUM MAGIC RESISTANCE", 1);
		b = check_option_choice_int(CONFIG_OPTIONS, "WIZARD", "MAXIMUM MAGIC RESISTANCE", 1);
		piece[p].magic_resist = IRand(a, b);

		a = check_option_choice_int(CONFIG_OPTIONS, "WIZARD", "CHANCE OF SPELL CASTING BONUS", 0);
		wizard[w].ability = 0;

		if (IRand(0, 99) <= a) {
			a = check_option_choice_int(CONFIG_OPTIONS, "WIZARD", "MINIMUM BONUS AMOUNT", 10) / 10;
			b = check_option_choice_int(CONFIG_OPTIONS, "WIZARD", "MAXIMUM BONUS AMOUNT", 10) / 10;

			wizard[w].ability = IRand(a, b) * 10;
		}
	}

	// Now create new pieces for each alive wizard.
	for (w = 0; w < MAX_WIZARDS; w++) {
		if (wizard[w].alive) {
			// Use WIZARD_x names to find any piece read from data file.
			// This stops hardcoded piece numbers.
			name = sprintf("Wizard_%d", w + 1);
			create_new_piece(name, wizard[w].x, wizard[w].y);
			board[wizard[w].x][wizard[w].y][PIECE].owner = w; // Mark wizard as owner.
			board[wizard[w].x][wizard[w].y][PIECE].turn = 1; // Set as oldest creature.
		}
	}

	// Indpendent creatures
	// --------------------

	game.current_wizard = INDEPENDENT;

	// Add Magic Wood trees?
	var vars = find_option_choice_variables(CONFIG_OPTIONS, "BOARD", "MAGIC WOOD TREES", a, b, null, name);
	a = vars[0];
	b = vars[1];
	name = vars[3];

	if (b > 0) {
		w = IRand(a, b);

		add_creatures_randomly_over_board(w, name);
	}

	// Add Walls?
	var vars = find_option_choice_variables(CONFIG_OPTIONS, "BOARD", "WALLS", a, b, null, name);
	a = vars[0];
	b = vars[1];
	name = vars[3];

	if (b > 0) {
		w = IRand(a, b);

		add_creatures_randomly_over_board(w, name);
	}

	// Add Generators?
	var vars = find_option_choice_variables(CONFIG_OPTIONS, "BOARD", "GENERATORS", a, b, null, name);
	a = vars[0];
	b = vars[1];
	name = vars[3];

	if (b > 0) {
		w = IRand(a, b);

		for (a = 0; a < w; a++) {
			x = IRand(board_info.board_width * 0.25, (board_info.board_width * 0.75));
			y = IRand(board_info.board_height * 0.25, (board_info.board_height * 0.75));

			if (board[x][y][PIECE].gfx == BLANK) {
				create_new_piece(name, x, y);
				board[x][y][PIECE].gfx += IRand(0, board[x][y][PIECE].gfx_frames - 1);
			}
		}
	}

}

function wizard_here(x, y) {
	var w;

	for (w = 0; w < MAX_WIZARDS; w++) {
		// Have we found a wizard at this square?
		if (wizard[w].x == x && wizard[w].y == y && wizard[w].alive) return w;
	}

	// No wizard here.
	return -1;
}

function kill_wizard(w, by) {
	var x, y;

	// Mark wizard as dead.
	wizard[w].alive = false;
	request_sound_effect("WIZARD", "WIZARD", "ABOUT TO DIE", true);
	request_sound_effect("WIZARD", "WIZARD", "DYING", false);

	do_wizard_dying_effect(wizard[w].x, wizard[w].y, 128);
	wait_time(400);

	kill_wizards_creatures(w, true);

	// Do we get spells for killing a wizard?
	var vars = find_option_choice_variables(CONFIG_OPTIONS, "SPELL", "NEW SPELLS FOR KILLING ENEMY WIZARD", x, null, null, null);
	x = vars[0];

	// Unless it is NEVER, see if we get a new spell this turn..
	if (x != 0 && by != -1) {
		add_spells(x, by); // Give new spell(s) to our wizard.
	}
}

function kill_wizards_creatures(w, all) {
	var x, y, score, best_score, best_x, best_y;

	best_score = -1;

	// Kill wizard's creatures.
	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			if (wizard_here(x, y) == w) continue;

			score = -1;
			if (board[x][y][PIECE].gfx != BLANK && board[x][y][PIECE].owner == w) score = AI_rate_piece(x, y, wizard[game.current_wizard].x, wizard[game.current_wizard].y, PIECE, true);

			if (score > best_score && !all) {
				best_score = score;
				best_x = x;
				best_y = y;
			}

			if (all) {
				// Remove any covered creatures here..
				if (board[x][y][PIECE_COVERED].owner == w) board[x][y][PIECE_COVERED].gfx = BLANK;
				if (board[x][y][MOUNTED_COVERED].owner == w) board[x][y][MOUNTED_COVERED].gfx = BLANK;

				// Do exploding effect.
				if (board[x][y][PIECE].gfx != BLANK && board[x][y][PIECE].owner == w) do_effect(EFFECT_EXPLODE, x, y, 64, 1);

				// Kill enemy on piece layer.
				if (board[x][y][PIECE].gfx != BLANK && board[x][y][PIECE].owner == w) kill_piece(x, y, - 1, false);

				// Any creature riding? Kill enemies as well!
				if (board[x][y][PIECE].gfx != BLANK && board[x][y][PIECE].owner == w) kill_piece(x, y, - 1, false);
			}
		}
	}

	if (!all && best_score > -1) {
		x = best_x;
		y = best_y;

		// Remove any covered creatures here..
		if (board[x][y][PIECE_COVERED].owner == w) board[x][y][PIECE_COVERED].gfx = BLANK;
		if (board[x][y][MOUNTED_COVERED].owner == w) board[x][y][MOUNTED_COVERED].gfx = BLANK;

		// Do exploding effect.
		if (board[x][y][PIECE].gfx != BLANK && board[x][y][PIECE].owner == w) do_effect(EFFECT_EXPLODE, x, y, 64, 1);

		// Kill enemy on piece layer.
		if (board[x][y][PIECE].gfx != BLANK && board[x][y][PIECE].owner == w) kill_piece(x, y, - 1, false);

		// Any creature riding? Kill enemies as well!
		if (board[x][y][PIECE].gfx != BLANK && board[x][y][PIECE].owner == w) kill_piece(x, y, - 1, false);
	}
	wait_time(100);
}

function check_for_winner() {
	var num, w, wiz;

	num = 0;
	for (w = 0; w < MAX_WIZARDS; w++) {
		if (wizard[w].alive) {
			wiz = w;
			num++;
		}
	}
	if (num == 1) game.winner = wiz; // Got a winner!
}