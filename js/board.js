var MAX_BOARD_WIDTH = 80;
var MAX_BOARD_HEIGHT = 80;
var MAX_BOARD_LAYERS = 5;

// Defines for the 3 different board layers

// The BODY layer stores all body details and is used for raise dead.
// The PIECE layer stores all the normal piece info.
// The MOUNTED layer stores details of wizards in trees, castes or riding mounts.
// Using a seperate layer lets us add creatures on mounts in the future.

var NO_LAYER = -1;
var BODY = 0;
var PIECE = 1;
var MOUNTED = 2;
var PIECE_COVERED = 3;
var MOUNTED_COVERED = 4;

var HIGHLIGHT_GFX_BOX = 12;
var HIGHLIGHT_GFX_SPELL = 14;
var HIGHLIGHT_GFX_FLY = 30;

var HIGHLIGHT_NONE = 0;
var HIGHLIGHT_CAN_CAST = 1;
var HIGHLIGHT_CAN_MOVE = 2;
var HIGHLIGHT_NO_MOVES_LEFT = 3;
var HIGHLIGHT_CAN_ATTACK = 4;
var HIGHLIGHT_CAN_RIDE = 5;
var HIGHLIGHT_ENEMY = 6;
var HIGHLIGHT_OUR_PIECE = 7;
var HIGHLIGHT_OUR_PIECE_MOVED = 8;
var HIGHLIGHT_GREY = 9;


var board={};
var highlight_board={};
var board_info={};
board_info.selected_alpha={};
board_info.highlight_alpha={};
board_info.grid_alpha={};
board_info.highlight_cycle = 0.02;

//create board object
for (y = 0; y < MAX_BOARD_HEIGHT; y++) {
	for (x = 0; x < MAX_BOARD_WIDTH; x++) {
		if( !board[x] ){
			board[x]={};
		}
		board[x][y]={};
		
		board[x][y][BODY]={};
		board[x][y][PIECE]={};
		board[x][y][MOUNTED]={};
		board[x][y][PIECE_COVERED]={};
		board[x][y][MOUNTED_COVERED]={};
		
		
		if( !highlight_board[x] ){
			highlight_board[x]={};
		}
		highlight_board[x][y]={};	
		
		highlight_board[x][y]['alpha']={};
	}
}

function setup_board() {
	var x, y;

	console.log("Setting up board..");

	// Blank all board and each layer.
	for (y = 0; y < MAX_BOARD_HEIGHT; y++) {
		for (x = 0; x < MAX_BOARD_WIDTH; x++) {
			board[x][y][BODY].gfx = BLANK;
			board[x][y][PIECE].gfx = BLANK;
			board[x][y][MOUNTED].gfx = BLANK;
			board[x][y][PIECE_COVERED].gfx = BLANK;
			board[x][y][MOUNTED_COVERED].gfx = BLANK;

			highlight_board[x][y].alpha.current = 0.0;
			highlight_board[x][y].alpha.target = 0.0;
			highlight_board[x][y].alpha.speed = 0.0025;
		}
	}

	// Set up default map size and map square size.
	x = 17 * 64;
	y = 13 * 64;

	//find_option_choice_variables(CONFIG_OPTIONS, "BOARD", "BOARD SIZE", board_info.board_width, board_info.board_height, null, null);
	board_info.board_width=17;
	board_info.board_height=13;

	board_info.square_width = x / board_info.board_width;
	board_info.square_height = y / board_info.board_height;
	if (board_info.square_height > board_info.square_width) board_info.square_height = board_info.square_width;
	if (board_info.square_width > board_info.square_height) board_info.square_width = board_info.square_height;

	board_info.scale = 64.0 / board_info.square_width;

	// Set up cloud layer values.
	board_info.cloud_x = 0;
	board_info.cloud_y = 0;

	board_info.border_size = 16;
	board_info.start_x = board_info.border_size;
	board_info.start_y = board_info.border_size;

	board_info.selected_alpha.current = 0.0;
	board_info.selected_alpha.target = 0.0;
	board_info.selected_alpha.speed = 0.01;

	board_info.highlight_alpha.current = 0.0;
	board_info.highlight_alpha.target = 0.0;
	board_info.highlight_alpha.speed = 0.01;

	board_info.grid_alpha.current = 0.0;
	board_info.grid_alpha.target = 0.0;
	board_info.grid_alpha.speed = 0.01;

	board_info.highlight_type = HIGHLIGHT_NONE;

	game.balance = 0; // Start of at Neutral Balance.
}

function do_highlight_board_logic() {
	var x, y;

	for (y = 0; y < MAX_BOARD_HEIGHT; y++) {
		for (x = 0; x < MAX_BOARD_WIDTH; x++) {
			do_alpha_logic(highlight_board[x][y].alpha);
		}
	}
}

function clear_highlight_board() {
	var x, y;

	for (y = 0; y < MAX_BOARD_HEIGHT; y++) {
		for (x = 0; x < MAX_BOARD_WIDTH; x++) {
			highlight_board[x][y].alpha.target = 0.0;
			highlight_board[x][y].alpha.speed = 0.05;
			highlight_board[x][y].move = -5.0;
			highlight_board[x][y].explored = true;
			highlight_board[x][y].from_x = -1;
			highlight_board[x][y].from_y = -1;
			highlight_board[x][y].type = HIGHLIGHT_NONE;
			highlight_board[x][y].AI_score = 0;
		}
	}
}

function hide_highlight_board(instant) {
	var x, y;

	for (y = 0; y < MAX_BOARD_HEIGHT; y++) {
		for (x = 0; x < MAX_BOARD_WIDTH; x++) {
			highlight_board[x][y].alpha.target = 0.0;
			highlight_board[x][y].alpha.speed = 0.05;

			if (instant) highlight_board[x][y].alpha.current = 0.0;
		}
	}
}

function highlight_wizard_pieces(wiz) {
	var own, engaged;
	var x, y;

	for (y = 0; y < MAX_BOARD_HEIGHT; y++) {
		for (x = 0; x < MAX_BOARD_WIDTH; x++) {
			// Erase any old owner highlighting
			if (highlight_board[x][y].type == HIGHLIGHT_ENEMY || highlight_board[x][y].type == HIGHLIGHT_OUR_PIECE || highlight_board[x][y].type == HIGHLIGHT_OUR_PIECE_MOVED) set_board_highlight(HIGHLIGHT_NONE, x, y);

			// Don't draw if already highlighted..
			if (highlight_board[x][y].type != HIGHLIGHT_NONE) continue;

			// Want to show owners by colour?
			if (board[x][y][MOUNTED].gfx != -1 && wiz == -1) {
				set_board_highlight(HIGHLIGHT_ENEMY, x, y);
				highlight_board[x][y].rgba = wizard[board[x][y][MOUNTED].owner].col;
				continue;
			}

			if (board[x][y][PIECE].gfx != -1 && wiz == -1) {
				set_board_highlight(HIGHLIGHT_ENEMY, x, y);
				highlight_board[x][y].rgba = wizard[board[x][y][PIECE].owner].col;
				continue;
			}

			if (wiz == -1) continue;

			// MOUNTED LAYER
			// -------------

			// Want to show only one wizard's creatures?
			if (board[x][y][MOUNTED].gfx != -1 && board[x][y][MOUNTED].owner == wiz) {
				if (wiz != game.current_wizard) {
					set_board_highlight(HIGHLIGHT_ENEMY, x, y);
				} else {
					// Piece can't do anything till next turn?
					if ((board[x][y][MOUNTED].has_moved || board[x][y][MOUNTED].movement == 0) && board[x][y][MOUNTED].has_attacked && board[x][y][MOUNTED].has_shot) {
						set_board_highlight(HIGHLIGHT_OUR_PIECE_MOVED, x, y);

						if (board[x][y][MOUNTED].gfx != -1 && (!board[x][y][MOUNTED].has_moved || !board[x][y][MOUNTED].has_attacked) && board[x][y][MOUNTED].owner == wiz) {
							set_board_highlight(HIGHLIGHT_OUR_PIECE, x, y);
						}
					} else {
						engaged = any_enemies_around_piece(x, y);
						set_board_highlight(HIGHLIGHT_OUR_PIECE, x, y);

						if (board[x][y][MOUNTED].has_moved && !engaged) {
							set_board_highlight(HIGHLIGHT_OUR_PIECE_MOVED, x, y);
						}
					}
				}
			}

			if (board[x][y][MOUNTED].gfx != -1) continue;

			// PIECE LAYER
			// -----------

			if (board[x][y][PIECE].gfx != -1 && board[x][y][PIECE].owner == wiz) {
				if (wiz != game.current_wizard) {
					set_board_highlight(HIGHLIGHT_ENEMY, x, y);
				} else {
					// Piece can't do anything till next turn?
					if ((board[x][y][PIECE].has_moved || board[x][y][PIECE].movement == 0) && board[x][y][PIECE].has_attacked && board[x][y][PIECE].has_shot) {
						set_board_highlight(HIGHLIGHT_OUR_PIECE_MOVED, x, y);

						if (board[x][y][MOUNTED].gfx != -1 && (!board[x][y][MOUNTED].has_moved || !board[x][y][MOUNTED].has_attacked) && board[x][y][MOUNTED].owner == wiz) {
							set_board_highlight(HIGHLIGHT_OUR_PIECE, x, y);
						}
					} else {
						engaged = any_enemies_around_piece(x, y);
						set_board_highlight(HIGHLIGHT_OUR_PIECE, x, y);

						if (board[x][y][PIECE].has_moved && !engaged) set_board_highlight(HIGHLIGHT_OUR_PIECE_MOVED, x, y);
					}
				}
			}


		}
	}
}

function set_highlight_board(tx, ty, range, layer, own, empty, enemy, los, clear, group) {
	var x, y, type, total;
	var dist;

	if (clear) clear_highlight_board();
	total = 0;
	if (range == 0) return 1; // We can always cast spells with a range of 0!

	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			dist = workout_range(tx, ty, x, y);

			// Check if we are within range. Adding +0.5 to deal with 1.5 cost of diagonal squares.
			if (dist > range + 0.5 && range != -1) continue; // Out of range!

			// Do we need to check for a line of sight?
			if (los && !line_of_sight(tx, ty, x, y)) continue;

			// Adjacent in a hostile group? (trees, etc..)
			if (adjacent_in_hostile_group(x, y, group)) continue;

			if (board[x][y][MOUNTED].gfx == -1) {
				if (board[x][y][layer].gfx != -1 && is_piece_friendly(x, y, layer) && !own) continue;
			}

			if (board[x][y][PIECE].gfx == -1 && !empty && range > 0) {
				// Special dark grey highlight (just to show range)
				set_board_highlight(HIGHLIGHT_GREY, x, y);

				if (layer == PIECE) continue;
			}
			if (board[x][y][layer].gfx != -1 && !is_piece_friendly(x, y, layer) && !enemy) continue;

			if (layer == BODY && board[x][y][PIECE].gfx != -1) continue; // Piece over a body..

			// Now set colour for this square and fade in..
			type = return_highlight_type(tx, ty, board_info.selected_layer, x, y, layer);

			if (type == HIGHLIGHT_CAN_RIDE && !own) continue;
			if (type == HIGHLIGHT_CAN_ATTACK && !enemy) continue;
			if (type == HIGHLIGHT_CAN_MOVE && !empty) continue;
			if (type == HIGHLIGHT_NONE) continue;

			set_board_highlight(type, x, y);
			total++;
		}
	}

	return total;
}

function highlight_land_movement_options(tx, ty) {
	var x, y;
	var done;

	clear_highlight_board();

	board_info.current_x = tx;
	board_info.current_y = ty;
	highlight_board[tx][ty].move = board[tx][ty][board_info.selected_layer].movement;

	// Shadow Form makes all creatures have at least a movement amount of 3 squares.
	if (board[tx][ty][board_info.selected_layer].shadow_form && highlight_board[tx][ty].move < 3) {
		highlight_board[tx][ty].move = 3;
	}

	highlight_board[tx][ty].from_x = tx;
	highlight_board[tx][ty].from_y = ty;

	explore_movement_from_board_square(tx, ty);

	start: done = true;

	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			if (!highlight_board[x][y].explored) {
				done = false;
				explore_movement_from_board_square(x, y);
			}
		}
	}

	//if (!done) goto start;
}

function explore_movement_from_board_square(tx, ty) {
	var x, y, type;
	var move, new_move;
	var engaged;

	highlight_board[tx][ty].explored = true;
	move = highlight_board[tx][ty].move;
	engaged = engaged_around_piece(tx, ty);

	// First turn we can attack any enemies, even if not engaged.
	if (board_info.current_x == tx && board_info.current_y == ty) engaged = any_enemies_around_piece(tx, ty);

	// Don't worry about first move away..
	if (board_info.current_x == tx && board_info.current_y == ty && move > 0.0 && !board[tx][ty][PIECE].engaged) engaged = false;

	if (move <= 0.0 && !engaged) return;

	for (y = ty - 1; y <= ty + 1; y++) {
		for (x = tx - 1; x <= tx + 1; x++) {
			if (x < 0 || y < 0 || x >= board_info.board_width || y >= board_info.board_height) continue;
			if (x == tx && y == ty) continue; // Don't need to do centre square.

			if (x == tx || y == ty) {
				// Horizontal or Vertical
				new_move = move - 1.0;
			} else {
				// Diagonal
				new_move = move - 1.5;
			}

			if (new_move >= highlight_board[x][y].move) {
				type = return_highlight_type(board_info.current_x, board_info.current_y, board_info.selected_layer, x, y, PIECE);

				// New unexplored square, or better route to this square.. Can we move here?
				if (engaged && type == HIGHLIGHT_CAN_MOVE) continue; // Can't move into blank square when engaged.
				if (engaged && type == HIGHLIGHT_CAN_RIDE) continue;

				highlight_board[x][y].move = new_move;
				if (!engaged && type == HIGHLIGHT_CAN_MOVE) highlight_board[x][y].explored = false; // Mark square to be further explored.

				// Add highlight of course.
				if (type != HIGHLIGHT_NONE){
					set_board_highlight(type, x, y);
				}

				highlight_board[x][y].from_x = tx;
				highlight_board[x][y].from_y = ty;
			}

		}
	}
}

function set_board_highlight(type, x, y) {
	var engaged;

	if (wizard[game.current_wizard].human || game.AI_debug) {
		highlight_board[x][y].alpha.target = 2.0;
		highlight_board[x][y].alpha.speed = 0.05;
	}

	engaged = any_enemies_around_piece(x, y);
	highlight_board[x][y].type = type;

	if (type == HIGHLIGHT_NONE) {
		highlight_board[x][y].alpha.target = 0.0;
	}

	// Default..
	highlight_board[x][y].gfx = 21;

	if (type == HIGHLIGHT_GREY) {
		highlight_board[x][y].rgba = Rgba(0.3, 0.3, 0.3);
		highlight_board[x][y].type = HIGHLIGHT_NONE;
	}

	if (type == HIGHLIGHT_CAN_MOVE) highlight_board[x][y].rgba = Rgba(1.0, 1.0, 0.0);
	if (type == HIGHLIGHT_CAN_MOVE && engaged) highlight_board[x][y].rgba = Rgba(1.0, 0.5, 0.0);
	if (type == HIGHLIGHT_CAN_CAST) highlight_board[x][y].rgba = Rgba(1.0, 1.0, 0.0);
	if (type == HIGHLIGHT_CAN_ATTACK) {
		highlight_board[x][y].rgba = Rgba(1.0, 0.0, 0.0);
		highlight_board[x][y].gfx = 32;
	}

	if (type == HIGHLIGHT_ENEMY) {
		highlight_board[x][y].rgba = Rgba(1.0, 0.0, 0.0);
		highlight_board[x][y].gfx = 36;
		highlight_board[x][y].type = HIGHLIGHT_NONE;
	}

	if (type == HIGHLIGHT_OUR_PIECE) {
		highlight_board[x][y].rgba = Rgba(0.0, 1.0, 0.0);
		highlight_board[x][y].gfx = 36;
		highlight_board[x][y].type = HIGHLIGHT_NONE;
	}

	if (type == HIGHLIGHT_OUR_PIECE_MOVED) {
		highlight_board[x][y].rgba = Rgba(0.0, 0.0, 1.0);
		highlight_board[x][y].gfx = 36;
		highlight_board[x][y].type = HIGHLIGHT_NONE;
	}

	if (type == HIGHLIGHT_CAN_RIDE) {
		highlight_board[x][y].rgba = Rgba(0.0, 1.0, 0.0);
		highlight_board[x][y].gfx = 32;
	}
	if (type == HIGHLIGHT_NO_MOVES_LEFT) highlight_board[x][y].rgba = Rgba(0.0, 0.0, 1.0);
}

function return_highlight_type(x1, y1, layer1, x2, y2, layer2) {
	var type, add;
	var engaged;

	type = HIGHLIGHT_NONE;

	if (board[x2][y2][layer2].gfx == -1) {
		type = HIGHLIGHT_CAN_MOVE;

	} else {
		if (layer2 == BODY) {
			type = HIGHLIGHT_CAN_RIDE;
			return type;
		}

		if (board[x1][y1][layer1].owner != board[x2][y2][layer2].owner) {
			type = HIGHLIGHT_CAN_ATTACK;
			if (board[x1][y1][layer1].combat < 1 && board[x1][y1][layer1].ranged_combat_attack < 1) type = HIGHLIGHT_NONE; // This piece has no combat capability!
			if (board[x2][y2][layer2].defence < 1) type = HIGHLIGHT_NONE; // This piece has invunerable defence capability!

			// The target is Undead, if we are in a movement phase then check undead rules to see if we can attack..
			if (board[x2][y2][layer2].undead && game.phase == PHASE_MOVEMENT) {
				var vars = find_option_choice_variables(CONFIG_OPTIONS, "GAME", "NORMAL CREATURE ATTACKS UNDEADS", add, null, null, null);
				add = vars[0];
		
				if (add == -1 && !board[x1][y1][layer1].can_attack_undead) type = HIGHLIGHT_NONE; // We can't attack!
			}

			if (game.phase == PHASE_MOVEMENT) {
				// Can this enemy be ridden by our piece?
				if (board[x1][y1][layer1].can_ride && board[x2][y2][layer2].rideable && board[x2][y2][MOUNTED].gfx == -1 && board[x2][y2][layer2].any_wizard_can_ride) type = HIGHLIGHT_CAN_RIDE;

				// Is our wizard mounted on an enemy creature?
				if (board[x2][y2][layer2].any_wizard_can_ride && board[x2][y2][MOUNTED].gfx != -1 && board[x2][y2][MOUNTED].owner == game.current_wizard) type = HIGHLIGHT_NONE;
			} else {
				if (is_piece_friendly(x2, y2, layer2)) type = HIGHLIGHT_CAN_RIDE;
			}
		} else {
			type = HIGHLIGHT_NONE;

			// If in movement, we have to check for rideable pieces..
			if (game.phase == PHASE_MOVEMENT) {
				if (board[x1][y1][layer1].can_ride && board[x2][y2][layer2].rideable && board[x2][y2][MOUNTED].gfx == -1) type = HIGHLIGHT_CAN_RIDE;

				if (board[x2][y2][MOUNTED].gfx != -1 && board[x2][y2][MOUNTED].owner != board[x1][y1][layer1].owner) {
					type = HIGHLIGHT_CAN_ATTACK; // Enemy riding our piece.

					if (board[x1][y1][layer1].combat < 1) type = HIGHLIGHT_NONE; // This piece has no combat capability!
					if (board[x2][y2][layer2].defence < 1) type = HIGHLIGHT_NONE; // This piece has invunerable defence capability!
				}
			} else {
				type = HIGHLIGHT_CAN_RIDE; // Default in spell selection and casting.
			}
		}
	}

	return type;
}

function clear_land_movement_route() {
	var x2, y2;

	for (y2 = 0; y2 < MAX_BOARD_HEIGHT; y2++) {
		for (x2 = 0; x2 < MAX_BOARD_WIDTH; x2++) {
			if (highlight_board[x2][y2].gfx < 32) highlight_board[x2][y2].gfx = 21;
		}
	}

}

function draw_land_movement_route(x, y) {
	var x2, y2, dx, dy, max, m, g;

	clear_land_movement_route();

	if (highlight_board[x][y].alpha.target < 1.0) return; // Not over a possible move square..

	for (m = 0; m < 40; m++) {
		x2 = highlight_board[x][y].from_x;
		y2 = highlight_board[x][y].from_y;
		dx = x - x2;
		dy = y - y2;

		if (dx == -1 && dy == -1) g = 22;
		if (dx == 0 && dy == -1) g = 23;
		if (dx == 1 && dy == -1) g = 24;
		if (dx == -1 && dy == 0) g = 25;
		if (dx == 1 && dy == 0) g = 26;
		if (dx == -1 && dy == 1) g = 27;
		if (dx == 0 && dy == 1) g = 28;
		if (dx == 1 && dy == 1) g = 29;

		x = x2;
		y = y2;

		if (x == -1) return;

		if (x == board_info.selected_x && y == board_info.selected_y) return;

		highlight_board[x][y].gfx = g;
	}
}

function draw_board_grid() {
	var x, y, l;
	x = board_info.start_x;
	y = board_info.start_y;
	if (board_info.grid_alpha.current == 0){
		return;
	}

	for (l = 0; l < board_info.board_height; l++) {
		drawLine(x, y, x + (board_info.board_width * board_info.square_width), y, 0.25, 0.0, 0.5, board_info.grid_alpha.current);

		y += board_info.square_height;
	}

	y = board_info.start_y;
	for (l = 0; l < board_info.board_width; l++) {
		drawLine(x, y, x, y + (board_info.board_height * board_info.square_height), 0.25, 0.0, 0.5, board_info.grid_alpha.current);

		x += board_info.square_width;
	}
}

function draw_board() {

	// Draw map view.
	var x, y, c;
	var alpha;
	var text;
	var image;

	// Draw clouds first.
	draw_background_clouds();
	draw_board_grid();

	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			alpha = MID(0.0, highlight_board[x][y].alpha.current, 1.0);

			if (board_info.highlight_x == x && board_info.highlight_y == y && board_info.highlight_alpha.current > 0.0 && highlight_board[x][y].gfx == 36){
				alpha = 0.0;
			}
			
			if (board_info.selected_x == x && board_info.selected_y == y && board_info.selected_alpha.current > 0.0 && highlight_board[x][y].gfx == 36){
				alpha = 0.0;
			}

			// Draw highlight effect.
			if (alpha > 0.0) {
				c = highlight_board[x][y].gfx;
				
				//gfx[c].setAlphaMode(BLENDER_ADD);

				gfx[c].setBlitColor(highlight_board[x][y].rgba.r, highlight_board[x][y].rgba.g,	highlight_board[x][y].rgba.b, alpha);

				gfx[c].stretchAlphaRect(0, 0, gfx[c].width, gfx[c].height, (x * board_info.square_width) + board_info.start_x, (y * board_info.square_height) + board_info.start_y, ((x + 1) * board_info.square_width) + board_info.start_x, ((y + 1) * board_info.square_height) + board_info.start_y);
			}

			c = board[x][y][PIECE].gfx;

			// Don't draw more than first frame if we have shadow form!
			//if (board[x][y][PIECE].shadow_form && c > board[x][y][PIECE].start_gfx) goto end; //FIXME

			if (c == BLANK) {
				// Ok, do we have a body gfx to draw?
				c = board[x][y][BODY].gfx;

				// Nope, so carry on in loop.
				//if (c == BLANK) goto end; // Skip blank map squares.    //FIXME
			}
			
			if (c != BLANK){							
				if (x == board_info.selected_x && y == board_info.selected_y) draw_selected_effect();
	
				piece_gfx[c].stretchAlphaRect(0, 0, piece_gfx[c].width, piece_gfx[c].height, (x * board_info.square_width) + board_info.start_x, (y * board_info.square_height) + board_info.start_y, ((x + 1) * board_info.square_width) + board_info.start_x, ((y + 1) * board_info.square_height) + board_info.start_y);
				
			}

			if (game.AI_debug && !wizard[game.current_wizard].human) {
				alpha = 1.0;
				text = sprintf("%d", highlight_board[x][y].AI_score);
				if (highlight_board[x][y].AI_score > 0) draw_text(text, (x * board_info.square_width) + board_info.start_x, 0, (y * board_info.square_height) + board_info.start_y, FONT_SMALL, 1, Rgba(1.0, 1.0, 1.0), alpha, TEXT_LEFT);

				// Best AI target?
				if (ai[game.current_wizard].target_x == x && ai[game.current_wizard].target_y == y) {
					draw_text(text, (x * board_info.square_width) + board_info.start_x, 0, (y * board_info.square_height) + board_info.start_y, FONT_SMALL, 1, Rgba(1.0, 1.0, 0.0), 1.0, TEXT_LEFT);
				}
			}
		}
	}

	draw_highlight_effect();

	// Recolour border pieces using current wizard colour.
	for (c = 0; c < 8; c++) {
		gfx[c].setBlitColor(wizard[game.current_wizard].col.r, wizard[game.current_wizard].col.g, wizard[game.current_wizard].col.b, 1.0);

		//gfx[c].setTextureQuality(false); // Disable bilinear filtering on border gfx to stop edge linup errors in low res.
	}

	// Top left corner
	gfx[0].stretchAlphaRect(0, 0, gfx[0].width, gfx[0].height,
	board_info.start_x - board_info.border_size, board_info.start_y - board_info.border_size,
	board_info.start_x, board_info.start_y);

	// Top border
	gfx[1].stretchAlphaRect(0, 0, gfx[0].width, gfx[0].height,
	board_info.start_x, board_info.start_y - board_info.border_size,
	board_info.start_x + (board_info.board_width * board_info.square_width) + board_info.border_size, board_info.start_y);

	// Top right corner
	gfx[2].stretchAlphaRect(0, 0, gfx[0].width, gfx[0].height,
	board_info.start_x + (board_info.board_width * board_info.square_width), board_info.start_y - board_info.border_size,
	board_info.start_x + (board_info.board_width * board_info.square_width) + board_info.border_size, board_info.start_y);

	// Left border
	gfx[3].stretchAlphaRect(0, 0, gfx[0].width, gfx[0].height,
	board_info.start_x - board_info.border_size, board_info.start_y,
	board_info.start_x, board_info.start_y + (board_info.board_height * board_info.square_height));

	// Right border
	gfx[4].stretchAlphaRect(0, 0, gfx[0].width, gfx[0].height,
	board_info.start_x + (board_info.board_width * board_info.square_width), board_info.start_y,
	board_info.start_x + (board_info.board_width * board_info.square_width) + board_info.border_size,
	board_info.start_y + (board_info.board_height * board_info.square_height));

	// Bottom left corner
	gfx[5].stretchAlphaRect(0, 0, gfx[0].width, gfx[0].height,
	board_info.start_x - board_info.border_size, board_info.start_y + (board_info.board_height * board_info.square_height),
	board_info.start_x, board_info.start_y + (board_info.board_height * board_info.square_height) + board_info.border_size);

	// Bottom border
	gfx[6].stretchAlphaRect(0, 0, gfx[0].width, gfx[0].height,
	board_info.start_x, board_info.start_y + (board_info.board_height * board_info.square_height),
	board_info.start_x + (board_info.board_width * board_info.square_width),
	board_info.start_y + (board_info.board_height * board_info.square_height) + board_info.border_size);

	// Bottom right corner
	gfx[7].stretchAlphaRect(0, 0, gfx[0].width, gfx[0].height,
	board_info.start_x + (board_info.board_width * board_info.square_width),
	board_info.start_y + (board_info.board_height * board_info.square_height),
	board_info.start_x + (board_info.board_width * board_info.square_width) + board_info.border_size,
	board_info.start_y + (board_info.board_height * board_info.square_height) + board_info.border_size);
}

function draw_selected_effect() {
	var x, y;
	var alpha;

	alpha = board_info.selected_alpha.current - (((cos(board_info.highlight_cycle) + 1.0) / 4.0));
	
	if (alpha < 0.0) return; // No selected effect visible.

	x = board_info.selected_x;
	y = board_info.selected_y;

	gfx[HIGHLIGHT_GFX_BOX].setBlitColor(1.0, 1.0, 1.0, alpha);
	
	gfx[HIGHLIGHT_GFX_BOX].stretchAlphaRect(0, 0, 64, 64,
	(x * board_info.square_width) + board_info.start_x, (y * board_info.square_height) + board_info.start_y, 
	((x + 1) * board_info.square_width) + board_info.start_x, ((y + 1) * board_info.square_height) + board_info.start_y);
}

function draw_highlight_effect() {
	var x, y, g;
	var alpha;
	var rgba;

	x = board_info.highlight_x;
	y = board_info.highlight_y;

	alpha = board_info.highlight_alpha.current - (((cos(board_info.highlight_cycle) + 1.0) / 4.0));
	if (alpha < 0.0) return;
	if (!wizard[game.current_wizard].human && !game.AI_debug) return;

	rgba = Rgba(1.0, 1.0, 1.0, alpha); // White is default.
	g = HIGHLIGHT_GFX_BOX; // Thick Box is default.

	if (board_info.highlight_type == HIGHLIGHT_NONE) return;
	if (board_info.highlight_type == HIGHLIGHT_CAN_CAST) g = HIGHLIGHT_GFX_SPELL;
	if (board_info.highlight_type == HIGHLIGHT_CAN_MOVE) {
		rgba = Rgba(1.0, 1.0, 0.0, alpha);

		if (board_info.selected_state && board[board_info.selected_x][board_info.selected_y][board_info.selected_layer].flying) {
			g = HIGHLIGHT_GFX_FLY;
			rgba = Rgba(1.0, 1.0, 1.0, alpha);
		}
	}

	if (board_info.highlight_type == HIGHLIGHT_NO_MOVES_LEFT) rgba = Rgba(0.0, 0.5, 1.0, alpha);
	if (board_info.highlight_type == HIGHLIGHT_CAN_ATTACK) rgba = Rgba(1.0, 0.0, 0.0, alpha);
	if (board_info.highlight_type == HIGHLIGHT_CAN_RIDE) rgba = Rgba(0.0, 1.0, 0.0, alpha);

	//gfx[g].setAlphaMode( BLENDER_ADD );
	gfx[g].setBlitColor(rgba.r, rgba.g, rgba.b, rgba.a);
	gfx[g].stretchAlphaRect(0, 0, gfx[g].width, gfx[g].height,
	(x * board_info.square_width) + board_info.start_x, (y * board_info.square_height) + board_info.start_y, 
	((x + 1) * board_info.square_width) + board_info.start_x, ((y + 1) * board_info.square_height) + board_info.start_y);
}


function draw_background_clouds() {
	var s, x;

	// Draw two layers of clouds to make nice cloud billowing effect.
	// We convert the var co-ordinates to ints to a bilinear filtering causing
	// black edge on texturing of clouds.

	// Layer 1 (moves horizontally)
	s = MAX((board_info.square_width * board_info.board_width), (board_info.square_height * board_info.board_height));
	x = board_info.cloud_x;
	
	// gfx[33].setAlphaMode(BLENDER_ADD);
	// gfx[33].allowTextureWrap(true);
	gfx[33].setBlitColor(0.3, 0.0, 0.5, 0.25);
	
	// Layer 1
	gfx[33].stretchAlphaRect(1, 1, gfx[33].width - 1, gfx[33].height - 1,
	board_info.start_x + x, board_info.start_y, board_info.start_x + x + s, board_info.start_y + s);
	
	if (x > 0)
	{
		gfx[33].stretchAlphaRect(1, 1, gfx[33].width - 1, gfx[33].height - 1,
		board_info.start_x + x - s, board_info.start_y, board_info.start_x + x, board_info.start_y + s);
	}
	
	// Layer 2
	gfx[33].stretchAlphaRect(1, 0, gfx[33].width - 1, gfx[33].height - 0,
	board_info.start_x, board_info.start_y + x, board_info.start_x + s, board_info.start_y + x + s);
	
	if (x > 0)
	{
		gfx[33].stretchAlphaRect(1, 0, gfx[33].width - 1, gfx[33].height - 0,
		board_info.start_x, board_info.start_y + x - s, board_info.start_x + s, board_info.start_y + x);
	}

}



function workout_range(x1, y1, x2, y2) {
	// Return distance in map squares between two sets of co-ordinates.
	// Diagonals are treated as 1.5 squares.

	var x, y, mn;

	x = ABS(x1 - x2);
	y = ABS(y1 - y2);

	mn = MIN(x, y) * 1.5;

	return (MAX(x, y) - MIN(x, y)) + mn;
}

function line_of_sight(x1, y1, x2, y2) {
	var dx, dy, x, y, rx, ry;
	var line, amount, new_x, new_y, new_x2, new_y2;

	amount = MAX(ABS(x2 - x1), ABS(y2 - y1)) * 3;
	x = x1 + 0.5;
	y = y1 + 0.5;

	dx = (x2 - x1) / amount;
	dy = (y2 - y1) / amount;

	//console.log("line of sight: %d, %d - %d, %d, dx: %f, dy: %f", x1, y1, x2, y2, dx, dy);

	for (line = 0; line < amount; line++) {
		rx = floorf(x);
		ry = floorf(y);

		new_x = floorf(x);
		new_y = floorf(y);
		new_x2 = new_x;
		new_y2 = new_y;

		if (x - rx < 0.15) new_x2--;
		if (x - rx > 0.85) new_x2++;

		if (y - ry < 0.15) new_y2--;
		if (y - ry > 0.85) new_y2++;

		new_x2 = MID(0, new_x2, board_info.board_width);
		new_y2 = MID(0, new_y2, board_info.board_height);
		x += dx;
		y += dy;

		if ((new_x2 == x1 && new_y2 == y1)) continue;
		if ((new_x2 == x2 && new_y2 == y2)) continue;

		else {
			//console.log("x: %d, y: %d - Gfx: %d", x, int(y), board[x][y][PIECE].gfx);
			if ((board[new_x][new_y][PIECE].gfx != BLANK && !board[new_x][new_y][PIECE].transparent_to_line_of_sight) && (board[new_x2][new_y2][PIECE].gfx != BLANK && !board[new_x2][new_y2][PIECE].transparent_to_line_of_sight)) return false;
		}
	}

	return true;
}

function swap_all_board() {
	var x, y, s, a, b;

	var s1;
	var s2;
	s = 0;

	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			s1[s][0] = x;
			s1[s][1] = y;
			s2[s][0] = x;
			s2[s][1] = y;

			s++;
		}
	}

	for (s = 0; s < 1000; s++) {
		a = Rand() % (board_info.board_width * board_info.board_height);
		b = Rand() % (board_info.board_width * board_info.board_height);

		x = s1[a][0];
		y = s1[a][1];
		s1[a][0] = s1[b][0];
		s1[a][1] = s1[b][1];
		s1[b][0] = x;
		s1[b][1] = y;
	}

	for (s = 0; s < 1000; s++) {
		a = Rand() % (board_info.board_width * board_info.board_height);
		b = Rand() % (board_info.board_width * board_info.board_height);

		x = s2[a][0];
		y = s2[a][1];
		s2[a][0] = s2[b][0];
		s2[a][1] = s2[b][1];
		s2[b][0] = x;
		s2[b][1] = y;
	}

	for (s = 0; s < (board_info.board_width * board_info.board_height); s++) {
		swap_pieces(s1[s][0], s1[s][1], s2[s][0], s2[s][1]);
		do_effect(EFFECT_SPELLCAST, s1[s][0], s1[s][1], 8, 0);
		do_effect(EFFECT_SPELLCAST, s2[s][0], s2[s][1], 8, 0);

		wait_time(5);
	}
}

function count_wizard_creatures_on_board(w) {
	var x, y, count;

	count = 0;
	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			if (board[x][y][PIECE].gfx != BLANK && board[x][y][PIECE].owner == w) count++;
			if (board[x][y][MOUNTED].gfx != BLANK && board[x][y][MOUNTED].owner == w) count++;
		}
	}

	return count;
}

function do_engaged_rule() {
	var x, y;
	var engaged, real;

	real = check_option_choice(CONFIG_OPTIONS, "GAME", "MANOEUVRE CHECK", "YES");

	for (y = 0; y < board_info.board_height; y++) {
		for (x = 0; x < board_info.board_width; x++) {
			if (board[x][y][PIECE].gfx == BLANK) continue;

			game.current_wizard = board[x][y][PIECE].owner;
			engaged = engaged_around_piece(x, y);

			board[x][y][PIECE].engaged = false;
			if (real && engaged && (IRand(2, 11) - board[x][y][PIECE].flex) >= 0) board[x][y][PIECE].engaged = engaged;
		}
	}
}

function add_creatures_randomly_over_board(num, name) {
	var x, y, a, b;

	for (a = 0; a < num; a++) {
		x = rand(0, board_info.board_width - 1);
		y = rand(0, board_info.board_height - 1);

		if (board[x][y][PIECE].gfx == BLANK) {
			create_new_piece(name, x, y);
			board[x][y][PIECE].gfx = rand(board[x][y][PIECE].start_gfx, board[x][y][PIECE].start_gfx+board[x][y][PIECE].gfx_frames - 1);
		}
	}
}