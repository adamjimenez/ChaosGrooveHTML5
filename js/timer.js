var timer = {};
timer.tnow = {};
timer.tstart = {};
timer.tticks = {};

// High resolution timer code for Windows. Call start_timer first and then call 
// check_timer with the required accuracy range.

//struct timer_t timer;

function start_timer() {
	timer.high_freq = QueryPerformanceFrequency(timer.tticks);
	timer.logic_frames = 0;

	if (timer.high_freq) {
		QueryPerformanceCounter(timer.tstart);
		timer.tlast = timer.tstart;
	}
}

function reset_timer() {
	if (timer.high_freq) {
		QueryPerformanceCounter(timer.tnow);
		timer.tstart = timer.tnow;
	}
}

function check_timer(frac_sec) {
	var t;

	if (timer.high_freq) {
		QueryPerformanceCounter(timer.tnow);
		t = (((timer.tnow.QuadPart - timer.tstart.QuadPart) * frac_sec) / timer.tticks.QuadPart);

		// Have we done 1 second since the timer was last reset?
		if (t > 240) {
			// Yes, so reset again and update details.
			// If we reset the timer after each check we get errors building up causing a lack
			// of precision. We also reset it here to make it as fast as possible.

			timer.tstart = timer.tlast;
			t -= timer.logic_frames;
			timer.logic_fps = timer.logic_frames;
			timer.logic_frames = 0;

			timer.gfx_fps = timer.gfx_frames;
			timer.gfx_frames = 0;
		}
		timer.tlast = timer.tnow;

		return t;
	}

	return 0;
}