var MAX_PIECES = 999;

// Define for blank map/piece element
var BLANK = -1;

var TYPE_WIZARD = 0;
var TYPE_CREATURE = 1;
var TYPE_GROWTH = 2;

var piece = {};

for (i = 0; i < MAX_PIECES; i++) {
	piece[i]={};
}

function load_all_pieces() {
	var frames, gfx, piece_num;
	var file, text, name, section;

	section = sprintf("GROOVE");

	piece_num = 0;
	gfx = 0;

	// First we look at the info file to find all the piece names to load..
	text = sprintf("Pieces\\info.ini");
	//file = sprintf("%s", KMiscTools.makeFilePath(text));

	//if (!set_config_file_new(CONFIG_TEMP, file, true)) return;

	// Find all piece names to load from info file
	for (piece_num = 0; piece_num < pieces.length; piece_num++) {
		text = sprintf("PIECE_%d", piece_num);
		//GetConfigString(CONFIG_TEMP, section, text, piece[piece_num].name, 40);
		
		piece[piece_num].name = pieces[piece_num].name;
	}

	// Now we load each one individually (gfx & stats).
	for (piece_num = 0; piece_num < MAX_PIECES; piece_num++) {
		if (strlen(piece[piece_num].name) < 2) return; // Reached end of list.

		section = sprintf("GROOVE");

		text = sprintf("Pieces\\%s\\%s\\", piece[piece_num].name, section);
		//file = sprintf("%s", KMiscTools.makeFilePath(text));
		frames = pieces[piece_num].num_images;
		
		LoadAndAddBitmaps(piece_gfx, pieces[piece_num].num_images, 'Pieces/'+piece[piece_num].name+'/Groove/');

		text = sprintf("Pieces\\%s\\info.ini", piece[piece_num].name);
		//file = sprintf("%s", KMiscTools.makeFilePath(text));

		//if (!set_config_file_new(CONFIG_TEMP, file, true)) return;

		// GROUP NAME
		//GetConfigString(CONFIG_TEMP, section, "GROUP", piece[piece_num].group_name, 40);
		piece[piece_num].group_name = pieces[piece_num].group;
		
		if (strlen(piece[piece_num].group_name) == 0) piece[piece_num].group_name = sprintf("CREATURE_GROUP"); // Creature Group is default.

		//piece[piece_num].adjacent_in_group = GetConfigYes(CONFIG_TEMP, section, "ADJACENT_IN_GROUP", true);
		piece[piece_num].adjacent_in_group = pieces[piece_num].adjacent_in_group;

		// TIME BETWEEN FRAMES, keeping a updated and original copy here.
		//piece[piece_num].time_between_frames = GetConfigInt(CONFIG_TEMP, section, "TIME_BETWEEN_FRAMES", 100);
		piece[piece_num].time_between_frames = 100;
		
		//piece[piece_num].time_next_frame = GetConfigInt(CONFIG_TEMP, section, "TIME_BETWEEN_FRAMES", 100);
		piece[piece_num].time_next_frame = 10;

		// PING PONG ANIM, the default is a ping pong anim, but we can also use a plain loop.
		//piece[piece_num].ping_pong_anim = GetConfigYes(CONFIG_TEMP, section, "PING_PONG_ANIM", true);
		piece[piece_num].ping_pong_anim = pieces[piece_num].ping_pong_anim;
		
		piece[piece_num].ping_pong_anim_forward = true;

		piece[piece_num].start_gfx = gfx;
		piece[piece_num].gfx = gfx;
		gfx += frames;

		// BODY_GFX, default = last gfx frame is the body gfx. 0 = No Body gfx frame.
		piece[piece_num].body_gfx = -1;
		
		//if (GetConfigInt(CONFIG_TEMP, section, "BODY_GFX", - 1) != 0) {			
		if (pieces[piece_num].body_gfx != 0) {
			piece[piece_num].body_gfx = gfx - 1;
			frames--;
		}
		piece[piece_num].gfx_frames = pieces[piece_num].num_images-1; //take away one for death image AJ

		// ----- Special Stats -----
		//piece[piece_num].chance_of_disappearing = GetConfigInt(CONFIG_TEMP, section, "CHANCE_OF_DISAPPEARING", 0);
		piece[piece_num].chance_of_disappearing = pieces[piece_num].chance_of_disappearing;
		
		//piece[piece_num].spells_when_disappeared = GetConfigInt(CONFIG_TEMP, section, "SPELLS_WHEN_DISAPPEARED", 0);
		piece[piece_num].spells_when_disappeared = pieces[piece_num].spells_when_disappeared;
		
		//piece[piece_num].only_disappear_when_ridden = GetConfigYes(CONFIG_TEMP, section, "ONLY_DISAPPEAR_WHEN_RIDDEN", false);
		piece[piece_num].only_disappear_when_ridden = pieces[piece_num].only_disappear_when_ridden;

		//piece[piece_num].any_wizard_can_ride = GetConfigYes(CONFIG_TEMP, section, "ANY_WIZARD_CAN_RIDE", false);
		piece[piece_num].any_wizard_can_ride = pieces[piece_num].any_wizard_can_ride;

		// Growing
		//piece[piece_num].grow_chance = GetConfigInt(CONFIG_TEMP, section, "GROW_CHANCE", 0);
		piece[piece_num].grow_chance = pieces[piece_num].grow_chance;
		
		
		//piece[piece_num].grow_attack = GetConfigInt(CONFIG_TEMP, section, "GROW_ATTACK", 0);
		piece[piece_num].grow_attack = pieces[piece_num].grow_attack;
		
		
		//piece[piece_num].grow_die_chance = GetConfigInt(CONFIG_TEMP, section, "GROW_DIE_CHANCE", 0);
		piece[piece_num].grow_die_chance = pieces[piece_num].grow_die_chance;
		
		
		//GetConfigString(CONFIG_TEMP, section, "GROW_PIECE", piece[piece_num].grow_piece_name, 40);
		piece[piece_num].grow_piece_name = pieces[piece_num].grow_piece_name;
		
		//piece[piece_num].grow_covers = GetConfigYes(CONFIG_TEMP, section, "GROW_COVERS", false);
		piece[piece_num].grow_covers = pieces[piece_num].grow_covers;

		//GetConfigString(CONFIG_TEMP, section, "DISAPPEAR_EFFECT", text, MAX_STRING);
		piece[piece_num].disappear_effect = pieces[piece_num].disappear_effect;
		
		
		piece[piece_num].disappear_effect = find_effect_by_name(text, EFFECT_NONE);
		
		//piece[piece_num].disappear_effect_var1 = GetConfigInt(CONFIG_TEMP, section, "DISAPPEAR_EFFECT_VAR1", 0);
		piece[piece_num].disappear_effect_var1 = pieces[piece_num].disappear_effect_var1;

		// Ranged combat effect..
		//GetConfigString(CONFIG_TEMP, section, "RANGED_COMBAT_EFFECT", text, MAX_STRING);
		piece[piece_num].ranged_combat_effect = pieces[piece_num].ranged_combat_effect;
		
		
		piece[piece_num].ranged_combat_effect = find_effect_by_name(text, EFFECT_ATTACK);
		
		//piece[piece_num].ranged_combat_effect_var1 = GetConfigInt(CONFIG_TEMP, section, "RANGED_COMBAT_EFFECT_VAR1", 1);
		piece[piece_num].ranged_combat_effect_var1 = pieces[piece_num].ranged_combat_effect_var1;

		// ----- Normal Stats -----

		// COMBAT
		//piece[piece_num].combat = GetConfigInt(CONFIG_TEMP, section, "COMBAT", 1);
		piece[piece_num].combat = pieces[piece_num].combat;

		// DEFENCE
		//piece[piece_num].defence = GetConfigInt(CONFIG_TEMP, section, "DEFENCE", 1);
		piece[piece_num].defence = pieces[piece_num].defence;

		// RANGED_COMBAT
		//piece[piece_num].ranged_combat_attack = GetConfigInt(CONFIG_TEMP, section, "RANGED_COMBAT", 0);
		piece[piece_num].ranged_combat_attack = pieces[piece_num].ranged_combat_attack;

		// RANGE
		//piece[piece_num].ranged_combat_range = GetConfigInt(CONFIG_TEMP, section, "RANGE", 0);
		piece[piece_num].ranged_combat_range = pieces[piece_num].ranged_combat_range;

		// RANGED_COMBAT GFX
		//piece[piece_num].ranged_combat_gfx = GetConfigInt(CONFIG_TEMP, section, "RANGED_COMBAT_GFX", 20);
		piece[piece_num].ranged_combat_gfx = pieces[piece_num].ranged_combat_gfx;

		// MOVEMENT
		//piece[piece_num].movement = GetConfigInt(CONFIG_TEMP, section, "MOVEMENT", 1);
		piece[piece_num].movement = pieces[piece_num].movement;

		// FLEX, I use the word flex (short for flexability) as maneuverability is difficult
		// to spell and type!
		//piece[piece_num].flex = GetConfigInt(CONFIG_TEMP, section, "FLEX", 1);
		piece[piece_num].flex = pieces[piece_num].flex;

		// MAGIC_RESISTANCE
		//piece[piece_num].magic_resist = GetConfigInt(CONFIG_TEMP, section, "MAGIC_RESISTANCE", 1);
		piece[piece_num].magic_resist = pieces[piece_num].magic_resist;

		// CHANCE
		//piece[piece_num].chance = GetConfigInt(CONFIG_TEMP, section, "CHANCE", 100);
		piece[piece_num].chance = pieces[piece_num].chance;

		// FLYING
		//piece[piece_num].flying = GetConfigYes(CONFIG_TEMP, section, "FLYING", false);
		piece[piece_num].flying = pieces[piece_num].flying;

		// RIDEABLE
		//piece[piece_num].rideable = GetConfigYes(CONFIG_TEMP, section, "RIDEABLE", false);
		piece[piece_num].rideable = pieces[piece_num].rideable;

		// UNDEAD
		//piece[piece_num].undead = GetConfigYes(CONFIG_TEMP, section, "UNDEAD", false);
		piece[piece_num].undead = pieces[piece_num].undead;
		
		//piece[piece_num].can_attack_undead = GetConfigYes(CONFIG_TEMP, section, "CAN_ATTACK_UNDEAD", piece[piece_num].undead);
		piece[piece_num].can_attack_undead = pieces[piece_num].can_attack_undead;

		// CAN_RIDE
		//piece[piece_num].can_ride = GetConfigYes(CONFIG_TEMP, section, "CAN_RIDE", false);
		piece[piece_num].can_ride = pieces[piece_num].can_ride;

		// SHADOW_FORM
		//piece[piece_num].shadow_form = GetConfigYes(CONFIG_TEMP, section, "SHADOW_FORM", false);
		piece[piece_num].shadow_form = pieces[piece_num].shadow_form;

		// TRANSPARENT_TO_LINE_OF_SIGHT
		//piece[piece_num].transparent_to_line_of_sight = GetConfigYes(CONFIG_TEMP, section, "TRANSPARENT_TO_LINE_OF_SIGHT", false);
		piece[piece_num].transparent_to_line_of_sight = pieces[piece_num].transparent_to_line_of_sight;

		if (piece[piece_num].combat < 1) piece[piece_num].has_attacked = true;
		if (piece[piece_num].ranged_combat_attack < 1) piece[piece_num].has_shot = true;
		if (piece[piece_num].movement < 1) piece[piece_num].has_moved = true;

		piece[piece_num].engaged = false;
	}
}

function do_pieces_animation_logic() {
	// This goes through every piece on the board and updates animation details.
	// Decreasing timing values and moving to next animation frame if required.

	var x, y, end_frame, time_between_frames;

	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			// Skip BLANK pieces.
			if (board[x][y][PIECE].gfx == BLANK) continue;

			end_frame = board[x][y][PIECE].start_gfx + board[x][y][PIECE].gfx_frames;
			time_between_frames = board[x][y][PIECE].time_between_frames;

			// Does piece have shadow form? This alters our animation!
			if (board[x][y][PIECE].shadow_form) {
				end_frame = board[x][y][PIECE].start_gfx + 2; // 2 frames for shadow form.
				time_between_frames = 200; // One constant speed. 
			}

			board[x][y][PIECE].time_next_frame--;

			// Time to change frame.
			if (board[x][y][PIECE].time_next_frame < 1) {
				
				// Restore timer value to original copy.
				board[x][y][PIECE].time_next_frame = time_between_frames;

				if (!board[x][y][PIECE].ping_pong_anim) {
					// Looping Animation
					board[x][y][PIECE].gfx++;

					// If we have just gone past the end gfx, then reset to the start.
					if (board[x][y][PIECE].gfx >= end_frame) {
						board[x][y][PIECE].gfx = board[x][y][PIECE].start_gfx;
					}
				} else {
					// Ping-Pong Animation
					if (board[x][y][PIECE].ping_pong_anim_forward == true) {
						// Animating Forward.
						board[x][y][PIECE].gfx++;

						// Gone past end, reverse animation direction.
						if (board[x][y][PIECE].gfx >= end_frame - 1) {
							board[x][y][PIECE].gfx = end_frame - 1;
							board[x][y][PIECE].ping_pong_anim_forward = false; // Reverse direction.
						}
					} else {
						// Animating Backwards.
						board[x][y][PIECE].gfx--;

						// Gone past start, reverse animation direction.
						if (board[x][y][PIECE].gfx <= board[x][y][PIECE].start_gfx) {
							board[x][y][PIECE].gfx = board[x][y][PIECE].start_gfx;
							board[x][y][PIECE].ping_pong_anim_forward = true; // Reverse direction.
						}
					}

				}

			}

		}
	}
}


function find_piece_by_name(name) {
	var s;

	for (s = 0; s < MAX_PIECES; s++) {
		if (strcmp(name, piece[s].name) == 0) return s;
	}

	return -1;
}

function create_new_piece(name, x, y) {
	// Creates a new piece and uses the name field to search for the corresponding
	// piece ID. This stops us using hardcoded varients (i.e. for magic sword, etc..)
	// and makes things more flexible.

	var p;
	p = find_piece_by_name(name);

	if (p == -1) {
		// Assume this doesn't matter, and is changed later. Pick Dire wolf as a default..
		p = find_piece_by_name("dire_wolf");
	}

	board[x][y][PIECE] = clone(piece[p]);
	board[x][y][PIECE].selected = false;
	board[x][y][PIECE].dead = false;
	board[x][y][PIECE].disbelieved = false;
	board[x][y][PIECE].illusion = wizard[game.current_wizard].spell_is_illusion;
	board[x][y][PIECE].owner = game.current_wizard; // Mark current wizard as owner. 
	board[x][y][PIECE].turn = 0; // New piece, so rest turn value.
}

function kill_piece(x, y, by, sound) {
	var p;

	// Have we just killed a wizard?
	if (board[x][y][MOUNTED].gfx == BLANK) {
		// No rider. Check if we have just killed a wizard..
		if (wizard_here(x, y) != -1) {
			kill_wizard(wizard_here(x, y), by);
		} else {
			if (sound) request_sound_effect(board[x][y][PIECE].name, "CREATURE", "DIES", false);
		}
	} else {
		if (sound) request_sound_effect(board[x][y][MOUNTED].name, "CREATURE", "DIES", false);
	}

	// If creature has a body gfx then deal with that now.
	if (board[x][y][PIECE].body_gfx != -1 && !board[x][y][PIECE].illusion) {
		// Move piece to body layer.
		board[x][y][BODY] = board[x][y][PIECE];

		// Now change gfx to body gfx and stop animation.
		board[x][y][BODY].gfx = board[x][y][BODY].body_gfx;

		board[x][y][BODY].start_gfx = board[x][y][BODY].body_gfx;
		board[x][y][BODY].dead = true;
		board[x][y][BODY].gfx_frames = 1;
	}

	// Turn old piece data on piece layer to BLANK
	board[x][y][PIECE].gfx = BLANK;
	board[x][y][PIECE].selected = false;

	// Did we have a rider on this piece?
	if (board[x][y][MOUNTED].gfx != BLANK) {
		if (game.debug_to_chat) console.log("PIECE : %s at x: %d, y: %d killed to make the rider : %s unmount",
		board[x][y][PIECE].name, x, y, board[x][y][MOUNTED].name);

		// Yes, so make rider available and visible by putting back on PIECE layer.
		board[x][y][PIECE] = board[x][y][MOUNTED];
		board[x][y][MOUNTED].gfx = BLANK;
	}

	// Finally check to see if this piece was a growth covering another piece.
	if (board[x][y][PIECE_COVERED].gfx != -1) {
		// Uncover creature
		board[x][y][PIECE] = board[x][y][PIECE_COVERED];
		board[x][y][MOUNTED] = board[x][y][MOUNTED_COVERED];

		if (game.debug_to_chat) console.log("Growth killed to uncover piece : %s", board[x][y][PIECE].name);

		// Mark covered layer as free.
		board[x][y][PIECE_COVERED].gfx = -1;

		// Restore movement & other status flags to uncovered piece(s)
		// PIECE layer
		p = board[x][y][PIECE].gfx;

		if (p != BLANK) {
			// Reset piece states.
			board[x][y][PIECE].has_moved = true;
			board[x][y][PIECE].has_attacked = true;
			board[x][y][PIECE].has_shot = true;

			if (board[x][y][PIECE].movement > 0 || board[x][y][PIECE].grow_chance > 0) board[x][y][PIECE].has_moved = false;
			if (board[x][y][PIECE].combat > 0) board[x][y][PIECE].has_attacked = false;
			if (board[x][y][PIECE].ranged_combat_attack > 0) board[x][y][PIECE].has_shot = false;
		}

		// MOUNTED layer
		p = board[x][y][MOUNTED].gfx;

		if (p != BLANK) {
			// Reset piece states.
			board[x][y][MOUNTED].has_moved = true;
			board[x][y][MOUNTED].has_attacked = true;
			board[x][y][MOUNTED].has_shot = true;

			if (board[x][y][MOUNTED].movement > 0) board[x][y][MOUNTED].has_moved = false;
			if (board[x][y][MOUNTED].combat > 0) board[x][y][MOUNTED].has_attacked = false;
			if (board[x][y][MOUNTED].ranged_combat_attack > 0) board[x][y][MOUNTED].has_shot = false;
		}
	}
}

function try_to_select_piece(x, y, real) {
	var engaged;
	var total;

	// Reset highlight first.
	board_info.highlight_alpha.target = 0.0;

	// Abort if trying to select BLANK piece.
	if (board[x][y][PIECE].gfx == BLANK) return false;

	// Abort if this is NOT one of the current wizard's pieces.
	if (!is_piece_friendly(x, y, PIECE)) return false;

	engaged = any_enemies_around_piece(x, y);

	//console.log("name: %s, x: %d, y: %d, moved: %d, attacked: %d, shot: %d", board[x][y][PIECE].name, x, y, board[x][y][PIECE].has_moved, board[x][y][PIECE].has_attacked, board[x][y][PIECE].has_shot);

	// Abort if this piece has already moved.    
	if ((board[x][y][PIECE].has_moved || board[x][y][PIECE].movement == 0) && board[x][y][PIECE].has_attacked && board[x][y][PIECE].has_shot) {
		//if (board[x][y][MOUNTED].gfx != -1 && !board[x][y][MOUNTED].has_moved) goto skip;

		board_info.highlight_type = HIGHLIGHT_NO_MOVES_LEFT;
		board_info.highlight_alpha.target = 1.0;
		board_info.highlight_x = x;
		board_info.highlight_y = y;
		return false;
	}

	skip:

	// We can only do close combat, but there are no enemies directly adjacent?
	if (board[x][y][PIECE].has_moved && board[x][y][PIECE].combat > 0 && !engaged && board[x][y][PIECE].has_shot) {
		board_info.highlight_type = HIGHLIGHT_NO_MOVES_LEFT;
		board_info.highlight_alpha.target = 1.0;
		board_info.highlight_x = x;
		board_info.highlight_y = y;
		return false;
	}

	// But can our selected piece also shoot?
	if (board[x][y][PIECE].has_moved && board[x][y][PIECE].has_attacked && !board[x][y][PIECE].has_shot) {
		// Yes, so highlight enemy pieces that can be shot..
		total = set_highlight_board(x, y, board[x][y][PIECE].ranged_combat_range, PIECE, false, false, true, true, true, "");

		// Any targets?
		if (total == 0) {
			board_info.highlight_type = HIGHLIGHT_NO_MOVES_LEFT;
			board_info.highlight_alpha.target = 1.0;
			board_info.highlight_x = x;
			board_info.highlight_y = y;
			return false;
		}
	}

	// Ok, we could select piece, but we don't really want to yet, so highlight it first to show it can be selected.
	if (!real) {
		board_info.highlight_type = HIGHLIGHT_CAN_MOVE;
		board_info.highlight_alpha.target = 1.0;

		highlight_wizard_pieces(game.current_wizard);

		board_info.highlight_x = x;
		board_info.highlight_y = y;
	} else {
		// Really select piece.
		board_info.selected_x = x;
		board_info.selected_y = y;
		board_info.highlight_type = HIGHLIGHT_NONE;
		board_info.selected_state = true;
		board[x][y][PIECE].selected = true;
		board_info.selected_layer = PIECE;
		board_info.selected_alpha.target = 1.0;
		board_info.selected_alpha.current = 1.0;

		request_sound_effect(board[x][y][PIECE].name, "CREATURE", "SELECTED", false);

		// Are we riding a piece that can't move or attack? If so switch to rider.
		if (board[x][y][PIECE].has_moved && board[x][y][PIECE].has_attacked && board[x][y][PIECE].has_shot) {
			board_info.selected_layer = MOUNTED;
		}

		if (!board[x][y][board_info.selected_layer].has_moved || !board[x][y][PIECE].has_attacked) {
			if (board[x][y][board_info.selected_layer].flying) {
				// Show flying creatures possible moves..
				if (board_info.selected_layer == PIECE && board[x][y][PIECE].engaged) {
					// Engaged, so show enemies directly around us.
					set_highlight_board(x, y, 1.0, PIECE, false, false, true, false, true, "");
				} else {
					// Not engaged, so show full range.
					set_highlight_board(x, y, board[x][y][board_info.selected_layer].movement, PIECE,
					board[x][y][board_info.selected_layer].can_ride, true, true, false, true, "");
				}
			} else {
				// Show land based creatures possible moves. The engaged check code is done within this function..
				highlight_land_movement_options(x, y);
			}
		} else {
			if (board[x][y][PIECE].has_attacked && !board[x][y][PIECE].has_shot) {
				set_highlight_board(x, y, board[x][y][PIECE].ranged_combat_range, PIECE, false, false, true, true, true, "");
			}
		}
	}

	return true;
}

function unselect_piece() {
	board_info.selected_state = false;
	board_info.selected_engaged = false;
	board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].selected = false;
	board_info.selected_layer = PIECE;
	board_info.selected_alpha.target = 0.0;

	// If we have no pieces left we can move then end turn.
	if (!any_pieces_we_can_move()) {
		game.end_turn = true;
		request_sound_effect("CREATURE", "CREATURE", "END TURN", false);
		wait_time(50);
	}
}

function try_to_move_piece(x, y, real) {
	var total;
	var name;

	//sprintf(name, "x: %d, y: %d, selected_x: %d, selected_y: %d", x, y, board_info.selected_x, board_info.selected_y);

	// Reset highlight in case we can't move.
	board_info.highlight_alpha.target = 0.0;
	//add_chat_line(name, wizard[game.current_wizard].col);

	if (x == board_info.selected_x && y == board_info.selected_y) {
		// Let computer player cancel movement by trying to move onto existing position.
		// Human players can't do this!
		if (real && !wizard[game.current_wizard].human) {
			board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_moved = true;
			board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_attacked = true;
			board_info.selected_engaged = false;
		}
		return; // Can't move piece over itself!
	}

	if (highlight_board[x][y].type == HIGHLIGHT_NONE) {
		clear_land_movement_route(); // Clear any old arrows to a misleading info being shown to player.
		return; // Can't move here!
	}

	// Set cursor highlight..  
	board_info.highlight_type = highlight_board[x][y].type;
	board_info.highlight_alpha.target = 1.0;
	board_info.highlight_x = x;
	board_info.highlight_y = y;

	// Land based movement?
	if (board_info.selected_state && !board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].flying && !board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_moved) {
		draw_land_movement_route(x, y);
	}

	if (!real) return; // Done highlighting, so if not really moving then return.

	hide_highlight_board(false);

	// Ok, move.
	if (!board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].flying && !board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_moved) {
		move_piece_along_route(x, y);
	} else {
		move_piece(x, y);
	}

	board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_moved = true;

	// Check if we have become engaged to an enemy piece. If we have not just mounted.
	if (board_info.selected_layer == PIECE && !board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_attacked) {
		board_info.selected_engaged = engaged_around_piece(board_info.selected_x, board_info.selected_y);
	}

	// If we are engaged, then now show possible attacks.
	if (board_info.selected_engaged && !board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_attacked) {
		request_sound_effect(board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].name, "CREATURE", "ENGAGED", false);

		set_highlight_board(board_info.selected_x, board_info.selected_y, 1.0, PIECE,
		false, false, true, false, true, "");
	} else {
		// Not engaged, so no close combat possible..
		board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_attacked = true;

		// But can our selected piece also shoot?
		if (!board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_shot) {
			// Yes, so highlight enemy pieces that can be shot..
			total = set_highlight_board(board_info.selected_x, board_info.selected_y,
			board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].ranged_combat_range, PIECE,
			false, false, true, true, true, "");

			// Any targets?
			if (total == 0) {
				clear_highlight_board();
				board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_shot = true;
			} else {
				request_sound_effect(board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].name, "CREATURE", "SHOOTING PHASE", true);
			}
		}
	}

	if (board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_attacked && board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_shot) {
		unselect_piece();
	}
}

function move_piece(x, y) {
	var total;
	var name;

	// Can we attack this new piece?
	if (highlight_board[x][y].type == HIGHLIGHT_CAN_ATTACK) {
		if (!board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_attacked) {
			attack_piece(x, y);

			// Can our selected piece also shoot?
			if (!board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_shot) {
				// Yes, so highlight enemy pieces that can be shot..
				total = set_highlight_board(board_info.selected_x, board_info.selected_y,
				board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].ranged_combat_range, PIECE,
				false, false, true, true, true, "");

				if (total == 0) {
					clear_highlight_board();
					board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_shot = true;
				}
			}
		} else {
			shoot_piece(x, y);
		}
		return;
	}

	// Can we 'mount' this piece?
	if (highlight_board[x][y].type == HIGHLIGHT_CAN_RIDE) {
		ride_piece(x, y);
		return;
	}

	// Must be able to move to this new position on the board then..
	if (game.debug_to_chat) {
		name = sprintf("%s moved from %d, %d to %d, %d", board[board_info.selected_x][board_info.selected_y][PIECE].name,
		board_info.selected_x, board_info.selected_y, x, y);
		add_chat_line(name, wizard[game.current_wizard].col);
	}

	// Move piece data.
	board[x][y][PIECE] = board[board_info.selected_x][board_info.selected_y][board_info.selected_layer];

	if (board_info.selected_layer == PIECE) {
		// Move any riders too..
		board[x][y][MOUNTED] = board[board_info.selected_x][board_info.selected_y][MOUNTED];

		// Turn old riding piece data to BLANK
		board[board_info.selected_x][board_info.selected_y][MOUNTED].gfx = BLANK;

		board[x][y][MOUNTED].has_moved = true;
		board[x][y][MOUNTED].has_attacked = true;
		board[x][y][MOUNTED].has_shot = true;
	}

	// Turn old piece data to BLANK
	board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].gfx = BLANK;

	// Are we moving our wizard? If so, keep track of new postion.
	if (wizard[game.current_wizard].x == board_info.selected_x && wizard[game.current_wizard].y == board_info.selected_y) {
		wizard[game.current_wizard].x = x;
		wizard[game.current_wizard].y = y;
	}

	// Update selected x and y.
	board_info.selected_x = x;
	board_info.selected_y = y;
	board_info.selected_layer = PIECE; // Now back on ground if we were riding..

	request_sound_effect(board[x][y][PIECE].name, "CREATURE", "MOVES", false);
}

function move_piece_along_route(x, y) {
	var t, x2, y2, ox, oy;

	ox = x;
	oy = y;

	start:

	x = ox;
	y = oy;

	// Work backwards from target until we find square connecting to our creature..
	for (t = 0; t < 40; t++) {
		x2 = highlight_board[x][y].from_x;
		y2 = highlight_board[x][y].from_y;

		//console.log("x: %d, y: %d, x2: %d, y2: %d", x, y, x2, y2);

		// Have we found connecting square to our piece?
		if (x2 == board_info.selected_x && y2 == board_info.selected_y) {
			//console.log("moving from x2: %d, y2: %d to x: %d, y: %d", board_info.selected_x, board_info.selected_y, x, y);
			move_piece(x, y);
			wait_time(35);

			// Have we reached target?
			if (t == 0 || (board_info.selected_engaged)) return;

			//goto start;
		}

		x = x2;
		y = y2;

	}
}

function ride_piece(x, y) {
	if (game.debug_to_chat) {
		console.log("%s at x: %d, y: %d rides %s at x: %d, y: %d",
		board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].name, board_info.selected_x,
		board_info.selected_y, board[x][y][PIECE].name, x, y);
	}

	// Move piece data.
	board[x][y][MOUNTED] = board[board_info.selected_x][board_info.selected_y][board_info.selected_layer];

	// Turn old piece data to BLANK
	board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].gfx = BLANK;

	// Are we moving our wizard? If so, keep track of new postion.
	if (wizard[game.current_wizard].x == board_info.selected_x && wizard[game.current_wizard].y == board_info.selected_y) {
		wizard[game.current_wizard].x = x;
		wizard[game.current_wizard].y = y;
	}

	// Sound effect.
	request_sound_effect(board[x][y][PIECE].name, "CREATURE", "MOUNTED", true);

	// Remove rider's movement status.
	board[x][y][MOUNTED].has_moved = true;
	board[x][y][MOUNTED].has_attacked = true;

	board[x][y][PIECE].has_moved = true;
	board[x][y][PIECE].has_attacked = true;
	board[x][y][PIECE].has_shot = true;

	// Update selected x and y.
	board_info.selected_x = x;
	board_info.selected_y = y;
	board_info.selected_layer = MOUNTED;

	clear_highlight_board();
}

function do_attack_calculation(att, def) {
	// Add random chance values.
	att = att + ((Rand() % 10) + 1);
	def = def + ((Rand() % 10) + 1);

	if (att > def) return true;

	return false;
}

function attack_piece(x, y) {
	var should_we_move;
	var def, att, p, add;
	var name;

	request_sound_effect(board[board_info.selected_x][board_info.selected_y][PIECE].name, "CREATURE", "ATTACKS", false);

	// Find attack value of current selected piece, and defence value of piece we are
	// trying to attack.
	att = board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].combat;
	def = MID(1, board[x][y][PIECE].defence + (board[x][y][PIECE].shadow_form * 3), 9);

	// Deal with Undeads.
	if (board[x][y][PIECE].undead) {
		var vars = find_option_choice_variables(CONFIG_OPTIONS, "GAME", "NORMAL CREATURE ATTACKS UNDEADS", add, null, null, null);
		add = vars[0];
		
		if (add != -1) def = MID(1, def + add, 9);
	}

	board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_attacked = true;
	clear_highlight_board();

	board_info.highlight_type = HIGHLIGHT_CAN_ATTACK;
	board_info.highlight_alpha.target = 0.0;
	board_info.highlight_x = x;
	board_info.highlight_y = y;

	if (board_info.selected_layer == PIECE) {
		// Attacking with piece, so rider can't now move or attack as well.
		board[board_info.selected_x][board_info.selected_y][MOUNTED].has_moved = true;
		board[board_info.selected_x][board_info.selected_y][MOUNTED].has_attacked = true;
		board[board_info.selected_x][board_info.selected_y][MOUNTED].has_shot = true;
	}

	do_attack_effect(x, y, 3); // Do attack effect 3 times for hand-hand combat.
	wait_time(225);

	// We've killed enemy piece!
	if (do_attack_calculation(att, def)) {
		name = sprintf("%s", board[x][y][PIECE].name);

		kill_piece(x, y, game.current_wizard, true);

		p = find_piece_by_name(board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].name);

		// If there is a wizard now here, we must have just killed a mount!
		if (wizard_here(x, y) != -1 && board[x][y][PIECE].gfx != BLANK) {
			request_sound_effect(name, "CREATURE", "MOUNT IS KILLED WHILE RIDDEN", true);
		}

		// Can piece normally move?
		should_we_move = piece[p].movement > 0;

		wait_time(100); // Wait a second to let body appear.

		// If this place is now BLANK then move into it with our piece.
		if (board[x][y][PIECE].gfx == BLANK && should_we_move) {
			move_piece(x, y);

			if (wizard_here(x, y) == game.current_wizard) {
				// We've just killed an enemy with our wizard and moved into it's square..
				request_sound_effect("WIZARD", "WIZARD", "KILLS ENEMY", true);
			}
		}
	} else {
		// Did we fail to kill a wizard?
		if (wizard_here(x, y) != -1 && board[x][y][MOUNTED].gfx == BLANK) {
			request_sound_effect("WIZARD", "WIZARD", "HIT BUT SURVIVES", true);
		}
	}

	// Remove engaged status now we have attacked something!
	board_info.selected_engaged = false;

	// Did we have shadow form?
	if (board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].shadow_form) {
		// Remove it, and reset gfx frame..
		board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].shadow_form = false;
		board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].gfx = board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].start_gfx;
	}

	// Remove any movement points from our piece, whether we won the attack or not.
	if (board_info.selected_state && board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_shot) end_move_piece();

	//board_info.highlight_type = HIGHLIGHT_NONE;
	board_info.highlight_alpha.target = 0.0;
}

function shoot_piece(x, y) {
	var def, att, add;
	var name;

	// Find attack value of current selected piece, and defence value of piece we are
	// trying to attack.
	att = board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].ranged_combat_attack;
	def = MID(1, board[x][y][PIECE].defence + (board[x][y][PIECE].shadow_form * 3), 9);

	// Deal with Undeads.
	if (board[x][y][PIECE].undead) {
		var vars = find_option_choice_variables(CONFIG_OPTIONS, "GAME", "NORMAL CREATURE ATTACKS UNDEADS", add, null, null, null);
		add = vars[0];
		
		if (add != -1) def = MID(1, def + add, 9);
	}

	board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_shot = true;
	clear_highlight_board();

	board_info.highlight_type = HIGHLIGHT_CAN_ATTACK;
	board_info.highlight_alpha.target = 0.0;
	board_info.highlight_x = x;
	board_info.highlight_y = y;

	request_sound_effect(board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].name, "CREATURE", "SHOOTS", false);

	// Do ranged attack effect.
	do_missile_effect(board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].ranged_combat_gfx,
	4.0, board_info.selected_x, board_info.selected_y, x, y);

	do_effect(board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].ranged_combat_effect, x, y,
	board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].ranged_combat_effect_var1, 1);

	request_sound_effect(board[x][y][PIECE].name, "CREATURE", "SHOT", true);

	wait_time(75);
	wait_time(board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].ranged_combat_effect_var1 * 4);

	// Did we have shadow form?
	if (board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].shadow_form) {
		// Remove it, and reset gfx frame..
		board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].shadow_form = false;
		board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].gfx = board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].start_gfx;
	}

	name = sprintf("%s", board[x][y][PIECE].name);

	// We've killed enemy piece!
	if (do_attack_calculation(att, def)) {
		if (wizard_here(x, y) == -1 && board[x][y][MOUNTED].gfx == BLANK) {
			request_sound_effect(name, "CREATURE", "SHOT AND KILLED", false);
		}
		kill_piece(x, y, game.current_wizard, true);
		wait_time(100); // Wait a second to let body appear. 

		if (wizard_here(x, y) != -1) request_sound_effect(name, "CREATURE", "MOUNT IS KILLED WHILE RIDDEN", true);
	} else {
		request_sound_effect(name, "CREATURE", "SHOT BUT ALIVE", true);
	}
}

function end_move_piece() {
	// Set status flags, and then unselect_piece.
	board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_moved = true;
	board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_attacked = true;
	board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].has_shot = true;
	unselect_piece();
}

function grow_piece(x, y) {
	var new_x, new_y, p, rnd, att, def, add;
	var name;

	// Select random new adjacent square within map boundary.
	for (;;) {
		rnd = IRand(0, 8);
		new_x = x;
		new_y = y;

		if (rnd == 0 || rnd == 3 || rnd == 5) new_x = x - 1;
		if (rnd == 2 || rnd == 4 || rnd == 6) new_x = x + 1;
		if (rnd == 0 || rnd == 1 || rnd == 2) new_y = y - 1;
		if (rnd == 5 || rnd == 6 || rnd == 7) new_y = y + 1;

		if (new_x >= 0 && new_y >= 0 && new_x < board_info.board_width && new_y < board_info.board_height) break;
	}

	att = board[x][y][PIECE].grow_attack + IRand(0, 9);

	// Piece already here at new grow target.
	if (board[new_x][new_y][PIECE].gfx != -1) {
		if (board[new_x][new_y][PIECE].owner == board[x][y][PIECE].owner) return; // Can't grow over own pieces..

		if (board[new_x][new_y][PIECE].defence == 0) {
			// Nothing can destroy these pieces normally! Does piece trying to grow now die?
			rnd = IRand(0, 99);
			if (rnd < board[x][y][PIECE].grow_die_chance) kill_piece(x, y, - 1, false);
			return;
		}

		if (att < 10) // 10 means always grow regardless of enemy defence..
		{
			// Try to beat enemy's defence to grow..
			def = MID(1, board[new_x][new_y][PIECE].defence + (board[new_x][new_y][PIECE].shadow_form * 3), 9) + IRand(0, 9);

			// Deal with Undeads.
			if (board[new_x][new_y][PIECE].undead) {
				var vars = find_option_choice_variables(CONFIG_OPTIONS, "GAME", "NORMAL CREATURE ATTACKS UNDEADS", add, null, null, null);
				add = vars[0];
				
				if (add != -1) def = MID(1, def + add, 9);
			}

			if (att <= def) return; // Failed!
		}

		// Does growth cover a piece, or kill it?
		if (board[x][y][PIECE].grow_covers) {
			if (wizard_here(new_x, new_y) != -1) {
				// Wizard here! So kill instead..
				kill_piece(new_x, new_y, board[x][y][PIECE].owner, false);
				if (board[new_x][new_y][PIECE].gfx != -1) kill_piece(new_x, new_y, board[x][y][PIECE].owner, false); // Must have been on a mount
			} else {
				if (board[new_x][new_y][PIECE_COVERED].gfx == -1) {
					if (board[new_x][new_y][PIECE].grow_chance == 0) {
						// Not a creature already covered here, and this target is not also capable of growing.. So move to cover layers!
						board[new_x][new_y][PIECE_COVERED] = board[new_x][new_y][PIECE];
						board[new_x][new_y][MOUNTED_COVERED] = board[new_x][new_y][MOUNTED];

						request_sound_effect(board[x][y][PIECE].name, "GROWTH", "COVERS", true);
					}
				}
			}
		} else {
			// Kill enemy piece(s)
			request_sound_effect(board[x][y][PIECE].name, "GROWTH", "KILLS", true);
			kill_piece(new_x, new_y, board[x][y][PIECE].owner, false);
			if (board[new_x][new_y][PIECE].gfx != -1) kill_piece(new_x, new_y, board[x][y][PIECE].owner, false); // Must have been a rider here..

			do_effect(EFFECT_EXPLODE, new_x, new_y, 64, 1);
		}
	}

	// Ok. Now we grow..
	p = find_piece_by_name(board[x][y][PIECE].grow_piece_name);
	name = sprintf("%s", piece[p].name);

	// Can't find piece.. Is this a reference to a group?
	if (p == -1) {
		p = pick_random_piece_by_group_name(board[x][y][PIECE].grow_piece_name);
		name = sprintf("%s", piece[p].name);
	}

	if (p == -1) return; // We couldn't find any piece to grow!

	create_new_piece(name, new_x, new_y);
	board[new_x][new_y][PIECE].just_grown = true; // This new piece shouldn't grow this turn.
	board[new_x][new_y][PIECE].owner = board[x][y][PIECE].owner; // This piece belongs to old piece's owner.
	request_sound_effect(name, "GROWTH", "GROWS", false);

	// See if piece dies after growing!
	rnd = IRand(0, 99);
	if (rnd < board[x][y][PIECE].grow_die_chance) kill_piece(x, y, - 1, false);

	wait_time(50);
}

function increase_all_pieces_turn_number() {
	var x, y, p;

	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			// PIECE layer
			p = board[x][y][PIECE].gfx;

			// Increase turn value for piece.
			if (p != BLANK) board[x][y][PIECE].turn++;

			// MOUNTED layer
			p = board[x][y][MOUNTED].gfx;

			// Increase turn value for piece.
			if (p != BLANK) board[x][y][MOUNTED].turn++;
		}
	}
}

function restore_all_pieces_status_flags() {
	var x, y, p;

	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			// PIECE layer
			p = board[x][y][PIECE].gfx;

			if (p != BLANK) {
				// Reset piece states.
				board[x][y][PIECE].has_moved = true;
				board[x][y][PIECE].has_attacked = true;
				board[x][y][PIECE].has_shot = true;
				board[x][y][PIECE].just_grown = false;

				if (board[x][y][PIECE].movement > 0 || board[x][y][PIECE].grow_chance > 0) board[x][y][PIECE].has_moved = false;
				if (board[x][y][PIECE].combat > 0) board[x][y][PIECE].has_attacked = false;
				if (board[x][y][PIECE].ranged_combat_attack > 0) board[x][y][PIECE].has_shot = false;
			}

			// MOUNTED layer
			p = board[x][y][MOUNTED].gfx;

			if (p != BLANK) {
				// Reset piece states.
				board[x][y][MOUNTED].has_moved = true;
				board[x][y][MOUNTED].has_attacked = true;
				board[x][y][MOUNTED].has_shot = true;

				if (board[x][y][MOUNTED].movement > 0) board[x][y][MOUNTED].has_moved = false;
				if (board[x][y][MOUNTED].combat > 0) board[x][y][MOUNTED].has_attacked = false;
				if (board[x][y][MOUNTED].ranged_combat_attack > 0) board[x][y][MOUNTED].has_shot = false;

			}
		}
	}
}

function any_enemies_around_piece(tx, ty) {
	var x1, y1, x2, y2, x, y;

	// Clip search so we don't go outside map.
	x1 = MAX(0, tx - 1);
	y1 = MAX(0, ty - 1);
	x2 = MIN(MAX_BOARD_WIDTH, tx + 1);
	y2 = MIN(MAX_BOARD_HEIGHT, ty + 1);

	for (y = y1; y <= y2; y++) {
		for (x = x1; x <= x2; x++) {
			if (board[x][y][PIECE].gfx == BLANK) continue;

			// Does this piece belong to another wizard? And can this piece attack or grow?
			if (!is_piece_friendly(x, y, PIECE) && (board[x][y][PIECE].combat > 0 || (board[x][y][PIECE].grow_chance > 0 && board[x][y][PIECE].defence > 0))) return true;
		}
	}

	return false;
}

function engaged_around_piece(tx, ty) {
	var x1, y1, x2, y2, x, y, add;

	// Clip search so we don't go outside map.
	x1 = MAX(0, tx - 1);
	y1 = MAX(0, ty - 1);
	x2 = MIN(MAX_BOARD_WIDTH, tx + 1);
	y2 = MIN(MAX_BOARD_HEIGHT, ty + 1);

	for (y = y1; y <= y2; y++) {
		for (x = x1; x <= x2; x++) {
			if (board[x][y][PIECE].gfx == BLANK) continue;
			if (tx == x && ty == y) continue;

			// Does this piece belong to another wizard? And can this piece attack?
			if (board[x][y][PIECE].owner != game.current_wizard && (board[x][y][PIECE].combat > 0 || board[x][y][PIECE].ranged_combat_attack > 0)) {
				if (board[x][y][PIECE].undead) {
					if (board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].can_attack_undead) return true;

					var vars = find_option_choice_variables(CONFIG_OPTIONS, "GAME", "NORMAL CREATURE ATTACKS UNDEADS", add, null, null, null);
					add = vars[0];
					
					if (add == -1) continue; // Can't attack undeads!
				}
				//console.log("x: %d, y: %d, owner: %d, tx: %d, ty: %d, owner: %d, combat: %d", x, y, board[x][y][PIECE].owner,
				//tx, ty, game.current_wizard, board[x][y][PIECE].combat);
				return true;
			}
		}
	}

	return false;
}

function adjacent_in_hostile_group(tx, ty, group) {
	var x1, y1, x2, y2, x, y;

	// Clip search so we don't go outside map.
	x1 = MAX(0, tx - 1);
	y1 = MAX(0, ty - 1);
	x2 = MIN(MAX_BOARD_WIDTH, tx + 1);
	y2 = MIN(MAX_BOARD_HEIGHT, ty + 1);

	for (y = y1; y <= y2; y++) {
		for (x = x1; x <= x2; x++) {
			if (x == tx && y == ty) continue;
			if (board[x][y][PIECE].gfx == BLANK) continue;

			// Does this piece belong to another wizard?
			if (strcmp(group, board[x][y][PIECE].group_name) == 0 && !board[x][y][PIECE].adjacent_in_group) return true;
		}
	}

	return false;
}

function any_pieces_we_can_move() {
	var x, y, p, shoot;

	var engaged;

	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			// PIECE layer
			p = board[x][y][PIECE].gfx;
			if (p == BLANK) continue;

			engaged = any_enemies_around_piece(x, y);
			shoot = 0;

			if (board[x][y][PIECE].owner == game.current_wizard) {
				if (!board[x][y][PIECE].has_shot) {
					shoot = set_highlight_board(x, y, board[x][y][PIECE].ranged_combat_range, PIECE, false, false, true, true, true, "");
					clear_highlight_board();
				}

				// Can this piece move?
				if (!(board[x][y][PIECE].has_moved || board[x][y][PIECE].movement == 0) || (!board[x][y][PIECE].has_attacked && engaged) || (!board[x][y][PIECE].has_shot && shoot > 0)) return true;
			}

			// MOUNTED layer
			p = board[x][y][MOUNTED].gfx;
			if (p == BLANK) continue;

			if (board[x][y][MOUNTED].owner == game.current_wizard) {
				// Can this piece move?
				if (!board[x][y][PIECE].rideable) continue; // This piece cannot normally be ridden! So, rider must be imprisoned.
				if (!board[x][y][MOUNTED].has_moved || (!board[x][y][MOUNTED].has_attacked && engaged)) return true;
			}

		}
	}

	// No pieces left we can move.
	return false;
}

function pick_random_piece_by_group_name(name) {
	var r, p, found;
	var new_piece;
	found = 0;

	// Make a list of all creatures with this name.
	for (p = 0; p < MAX_PIECES; p++) {
		//console.log("name: %s, piece group name: %s, spell group name: %s", piece[p].name, piece[p].group_name, name);
		if (strcmp(piece[p].group_name, name) == 0) {
			new_piece[found] = p;
			found++;
			//console.log("found: %d", found);
		}
	}

	if (found == 0) return -1; // No pieces with this group name.

	// Now pick a piece randomly from our list.
	r = IRand(0, found - 1);

	return new_piece[r];
}

function swap_pieces(x1, y1, x2, y2) {
	var a, w1, w2;
	var p;

	w1 = wizard_here(x1, y1);
	w2 = wizard_here(x2, y2);

	//console.log("x1: %d, y1: %d, w1: %d", x1, y1, w1);
	//console.log("x2: %d, y2: %d, w2: %d", x2, y2, w2);

	for (a = 0; a < MAX_BOARD_LAYERS; a++) {
		p[a] = board[x1][y1][a];
		board[x1][y1][a] = board[x2][y2][a];
		board[x2][y2][a] = p[a];

		if (w1 != -1) {
			wizard[w1].x = x2;
			wizard[w1].y = y2;
		}
		if (w2 != -1) {
			wizard[w2].x = x1;
			wizard[w2].y = y1;
		}
	}

}

function is_piece_friendly(x, y, layer) {
	if (board[x][y][layer].owner != game.current_wizard) {
		//console.log("name: %s, mounted gfx: %d, can_ride: %d", board[x][y][layer].name, board[x][y][MOUNTED].gfx, board[x][y][layer].any_wizard_can_ride);
		if (layer == PIECE && board[x][y][MOUNTED].gfx == -1 && board[x][y][layer].any_wizard_can_ride) return true;
		if (layer == PIECE && board[x][y][MOUNTED].gfx != -1 && board[x][y][layer].any_wizard_can_ride && board[x][y][MOUNTED].owner == game.current_wizard) return true;

		return false;
	}

	if (board[x][y][layer].owner == game.current_wizard) return true;

	return false;
}