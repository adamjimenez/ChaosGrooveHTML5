var MAX_SOUNDS = 1024;
var sound = {};
var music = {};
music.volume = {};
var CONFIG_SOUNDS = {};

function setup_sound_system() {
	console.log("Setting up sounds..");

	load_all_memory_sounds();

	music.volume.current = 0.0;
	music.volume.target = 1.0;
	music.volume.speed = 0.005;

	return true;
}

function load_music() {
	var name, text;

	name = sprintf("\\text_files\\title_music.ini");
	name = sprintf("%s", KMiscTools.makeFilePath(name));

	if (!set_config_file_new(CONFIG_TITLE_MUSIC, name, false)) {
		console.log("Can't open title_music config file!");
		return false;
	}

	if (music.mod) {
		music.mod.stopModule();
	}

	music.mod = null;
	music.mod = new KSound;

	find_random_line_from_text_config(CONFIG_TITLE_MUSIC, text);
	console.log("Loading Music: %s", text);

	name = sprintf("Music\\%s.mod", text);
	name = sprintf("%s", KMiscTools.makeFilePath(name));

	if (!music.mod.loadModule(name)) {
		console.log("Couldn't load music from : %s", name);
		return false;
	}
	console.log("");

	//myMusic.playModule( true ) ; //play and loop
	return true;
}

function play_music() {
	if (music.mod) {
		music.mod.stopModule();
		music.mod.playModule(true);

		//music.volume.current = 0.0;
		music.volume.target = 1.0;
		wait_time(240);
	}
}

function do_music_logic() {
	var c;

	do_alpha_logic(music.volume);
	if (music.mod) {
		var vars = find_option_choice_variables(CONFIG_OPTIONS, "SOUND", "MUSIC VOLUME", c, null, null, null);
		c = vars[0];
		
		music.mod.setVolume(music.volume.current * c);

		c = find_current_option_choice(CONFIG_OPTIONS, "SOUND", "SOUND BALANCE");

		if (c == 0) music.mod.setPan(-100);
		if (c == 1) music.mod.setPan(0);
		if (c == 2) music.mod.setPan(100);
	}

	return; //fudge;
	
	// Switched away?
	if (!CheckWindowFocus()) {
		if (music.mod && music.mod.isPlaying()) {
			music.mod.pauseModule();
		}
	} else {
		// No, but have we just switched back in?
		if (music.mod && !music.mod.isPlaying()) {
			music.mod.continueModule();
		}
	}
}

function load_all_memory_sounds() {
	var s;
	var name, filepath;

	// We leave our first entry as free for one off loaded sounds..
	sound.available_sounds = 1;

	name = sprintf("Sounds\\Memory\\*.*");
	//filepath = sprintf("%s", KMiscTools.makeFilePath(name));
	//KMiscTools.enumerateFolder(filepath, load_sound);

	console.log("Loaded %d sounds into memory..", sound.available_sounds);

	return true;
}

function load_sound(f, isFolder, userData) {
	var name;

	if (isFolder) return true; // Skip folders.

	name = sprintf("Sounds\\Memory\\%s", f);
	//name = sprintf("%s", KMiscTools.makeFilePath(name));

	sound.sample[sound.available_sounds] = null;
	sound.sample[sound.available_sounds] = new KSound;

	if (!sound.sample[sound.available_sounds].loadSample(name)) return true; // Can't load this sound.

	sound.name[sound.available_sounds] = sprintf("%s", f);
	sound.available_sounds++;

	//console.log("%s, %s", name, f);

	if (sound.available_sounds >= MAX_SOUNDS) return false; // Can't load any more sounds..

	return true;
}

function return_sound_number(name) {
	var s;
	var new_name;

	for (s = 0; s < sound.available_sounds; s++) {
		new_name = sprintf("%s.wav", name);
		if (stricmp(new_name, sound.name[s]) == 0) return s;

		new_name = sprintf("%s.ogg", name);
		if (stricmp(new_name, sound.name[s]) == 0) return s;
	}

	return -1; // We couldn't find this sound!
}

function play_sound(name, wait) {
	console.log('play sound: '+name);
	
	var s, v;

	s = return_sound_number(name);
	//console.log("name: %s, s: %d", name, s);
	if (s == -1) return -1; // Couldn't find sound name!

	var vars = find_option_choice_variables(CONFIG_OPTIONS, "SOUND", "SOUND EFFECTS VOLUME", v, null, null, null);
	v = vars[0];
	
	if (v <= 0) return s;

	sound.sample[s].playSample();
	sound.sample[s].setVolume(v);

	v = find_current_option_choice(CONFIG_OPTIONS, "SOUND", "SOUND BALANCE");

	if (v == 0) sound.sample[s].setPan(-100);
	if (v == 1) sound.sample[s].setPan(0);
	if (v == 2) sound.sample[s].setPan(100);

	if (wait && !game.AI_debug) do {
		wait_time(1);
	} while (sound.sample[s].isPlaying());

	return s;
}

function request_sound_effect(specific, general, behaviour, wait) {	
	var name=specific+'..'+behaviour;
	
	console.log('request sound: '+name);	

	if( sounds[name] ){
		var wav=sounds[name][rand(0,sounds[name].length-1)];	
	}else{
		console.log('no sound: '+sounds[name]);
		return;
	}

	console.log('playing sound '+'Sounds/Memory/'+wav+'.wav');
				
	var audio = new Audio('Sounds/Memory/'+wav+'.wav');
	audio.play();
	
	return;
	
	var ret;
	var c, choices;
	var name, result, var1;

	name = sprintf("%s..%s", specific, behaviour);
	//console.log("name: %s", name);

	jump: GetConfigString(CONFIG_SOUNDS, name, "SAMPLE 1", result, MAX_STRING);
	if (strlen(result) == 0) GetConfigString(CONFIG_SOUNDS, name, "GOTO 1", result, MAX_STRING);

	// Did we find anything with our specific request?
	if (strlen(result) == 0) {
		// No. So, let's try our general request..
		name = sprintf("%s..%s", general, behaviour);
		GetConfigString(CONFIG_SOUNDS, name, "SAMPLE 1", result, MAX_STRING);
		if (strlen(result) == 0) GetConfigString(CONFIG_SOUNDS, name, "GOTO 1", result, MAX_STRING);
	}

	if (strlen(result) == 0) return -1; // Couldn't find any sample options.

	// Ok, we've found at least one option, now let's see how many choices there are..
	c = 0;
	do {
		c++;
		var1 = sprintf("SAMPLE %d", c);
		GetConfigString(CONFIG_SOUNDS, name, var1, result, MAX_STRING);

		// Did we find a Sample entry?
		if (strlen(result) == 0) {
			// No? Maybe a Goto jump instead?
			var1 = sprintf("GOTO %d", c);
			GetConfigString(CONFIG_SOUNDS, name, var1, result, MAX_STRING);
		}
	} while (strlen(result) > 0);

	// Number of choices found.
	choices = c - 1;

	//console.log("choices: %d", choices);

	c = IRand(1, choices);
	var1 = sprintf("SAMPLE %d", c);
	GetConfigString(CONFIG_SOUNDS, name, var1, result, MAX_STRING);

	// Not a sample?
	if (strlen(result) == 0) {
		var1 = sprintf("GOTO %d", c);
		GetConfigString(CONFIG_SOUNDS, name, var1, result, MAX_STRING);

		// It's a goto instead..
		if (strlen(result) > 0) {
			name = sprintf("%s", result);
			//console.log("GOTO : %s", name);
			//goto jump; // Repick a sample..
		}
	}

	// Play sound
	return play_sound(result, wait);
}