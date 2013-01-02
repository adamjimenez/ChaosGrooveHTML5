// bridge (.Cpp)
// -----------------
// Bridge code (used to add some handy RGBA code as well as wrap around some PTK functions)
// Necessary objects.
//KWindow *gwin;
// Rgba class:
var BLACK = Rgba( 0.0, 0.0, 0.0, 1.0 );
var WHITE = Rgba( 1.0, 1.0, 1.0, 1.0 );
var RED = Rgba( 1.0, 0.0, 0.0, 1.0 );
var YELLOW = Rgba( 1.0, 1.0, 0.0, 1.0 );
var GREEN = Rgba( 0.0, 1.0, 0.0, 1.0 );
var BLUE = Rgba( 0.0, 0.0, 1.0, 1.0 );
var INVISIBLE = Rgba( 0.0, 0.0, 0.0, 0.0 );

var KInput = {
	getLeftButtonState: false,
	getRightButtonState: false,
	getMouseX: 0,
	getMouseY: 0
};

function Rgba( r, g, b, a ){
	if( !a ){
		a=1;
	}
	
	if( r<=1 ){
		r = parseInt(r * 255);
	}
	
	if( g<=1 ){
		g = parseInt(g * 255);
	}
	
	if( b<=1 ){
		b = parseInt(b * 255);
	}
	
	if( a<=1 ){
		a = parseInt(a * 255);
	}

	return {
		r: r/255,
		g: g/255,
		b: b/255,
		a: a/255,
		css: 'Rgba( '+r+', '+g+', '+b+', '+a+' )'	
	}
}

function MixWith(other, factor) {
	var red = r + (other.r - r) * factor;
	var green = g + (other.g - g) * factor;
	var blue = b + (other.b - b) * factor;
	var alpha = a + (other.a - a) * factor;

	return 'Rgba( red, green, blue, alpha )';
}

/*
function SpecialPacked() {
	return (Rgba::CompToI(a) << 24) | (Rgba::CompToI(r) << 16) | (Rgba::CompToI(g) << 8) | Rgba::CompToI(b);
}
*/

/*
Rgba( int col, bool notUsed )
: r( CompToF(( col >> 16 ) & 0xff)), g( CompToF(( col >> 8 ) & 0xff)),
b( CompToF( col & 0xff)), a( CompToF(( col >> 24 ) & 0xff)) {
	notUsed = true;
}

Rgba( bool invalidiate )
: r( -1.0 ), g( -1.0 ), b( -1.0 ), a( -1.0 ) {
	invalidiate = true;
}*/


function IsValid() {
	return r >= 0.0 && g >= 0.0 && b >= 0.0 && a >= 0.0;
}

function Packed() {
	return NULL;
}

// RandomNum code:
function Seed(newSeed) {
	rand_info.seed = newSeed;
}

function SeedFromTime() {
	rand_info.seed = time(0);

	return rand_info.seed;
}

/*
function Rand() {
	rand_info.seed = (201 * rand_info.seed + 11) % 4294967295;

	return (ABS(rand_info.seed) % 65535);
}
*/

// Returns a Floating point random number between min and max.
function FRand(min, max) {
	return min + float(Rand()) / float(RAND_MAX) * (max - min);
}

function IRand(min, max) {
	if (min > max) return max + (rand() % (min + 1 - max));

	return min + (rand() % (max + 1 - min));
}

/*
function LoadListOfBitmaps( filenameBegin, extension, numNumbers)
{
   var bitmapList;
   
   for( index = 1;; index++ )
   {
      var stream;
      stream << index;
      var numbers = stream.str();
      
      while( numbers.size() < numNumbers )
	  {
         numbers = string("0") + numbers;
      }
      
      var filename = filenameBegin + numbers + string(".") + extension;

      var frame = NULL;
	  frame = KPTK::createKGraphic() ;
      
	  if( !frame->loadPicture( KMiscTools::makeFilePath(filename.c_str()), true, true ))
	  {
         delete frame;
         break;
      }
      
	  frame->setTextureQuality( true );
      bitmapList.push_back( frame );
   }
   
   return bitmapList;
}
*/

function LoadAndAddBitmaps(list, num, dir)
{
	for( i=0; i < num; i++ ){
		var img  = new Image();
		img.src = dir+i+'.png';
		
		list.push(img);
		
		img.onload=function(){
			this.onload=null;
			this.loaded=true;

			for (i = 0; i < piece_gfx.length; i++) {
				if( !piece_gfx[i].loaded ){
					return false;
				}
			}

			for (i = 0; i < spell_icon_gfx.length; i++) {
				if( !spell_icon_gfx[i].loaded ){
					return false;
				}
			}
			
			console.log('loaded bitmaps');
			ingame_loop();
		}
	}
	
	return num;
}

/*
function CheckQuit()
{
 return gwin->isQuit();
}

function CheckWindowFocus()
{
 return gwin->hasFocus();
}
function RestoreWindow()
{
 gwin->restore();
}

function Rest(time)
{
 #if !defined __APPLE__
 Sleep(time);
 #endif
}
*/
/*
function CreateGameScreen(width, height, window, dx)
{
	// Open DirectX or OpenGL gfx context.
	if (dx == false) gwin = KPTK::createKWindow( K_OPENGL );
	if ( dx == true) gwin = KPTK::createKWindow( K_DIRECTX );

	// Now try to open screen with requested details.
	if (!gwin->createGameWindow( width, height, 32, window, "Chaos Groove" )) return false;

	// Clear newly created screen.
	ClearScreen();

	game.opengl = 1 - dx;
	return true;
}
*/
/*
function ListScreenModes()
{
 gwin->enumerateDisplays(ListDisplays);
}
*/

/*
function ListDisplays(kd)
{
 log( "%d %d %d bpp - %d hz" , kd->width , kd->height , kd->depth, kd->frequency ) ;
 return true ;
}
*/

/*
function get_desktop_resolution(width, height)
{
 #if !defined __APPLE__
   HDC dc;

   dc = GetDC(NULL);
   *width  = GetDeviceCaps(dc, HORZRES);
   *height = GetDeviceCaps(dc, VERTRES);
   ReleaseDC(NULL, dc);

   return 0;
 #endif
}
*/

function ScreenWidth()
{
 return canvas.width;
}

function ScreenHeight()
{
 return canvas.height;
}

function ClearScreen()
{
	// Clear newly created screen.
	//gwin->setWorldView(0, 0, 0, 1.0, true);
	context.clearRect ( 0, 0, canvas.width, canvas.height );
}

/*
function MessageBox(title, maintext) {
	// Display messagebox with error details.
	KMiscTools::messageBox(title, maintext);

	// Record error in logfile too.
	log("");
	log("Messagebox error :");
	log(title);
	log("--");
	log(maintext);
	log("");
}
*/

function UpdateScreen()
{
	//return;
	
	// Flip screen buffer.
	//gwin->flipBackBuffer( false ) ;
	//gwin->processEvents( ) ;
	
	var ctx = canvas.getContext("2d");
	
//	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	
	ctx.drawImage(buffer, 0, 0);
	
	//drawRect( rand(100,1000), 100, 100, 100, 1, 1, 1 )
	
	//clear buffer
	//ClearScreen();
}

function Key(k)
{
	return KInput.isPressed( EKeyboardLayout(k) );
}

function LeftMouseButton()
{
	return KInput.getLeftButtonState;
}

function RightMouseButton()
{
	return KInput.getRightButtonState;
}

function GetMouseMickeys(x, y)
{
	/*
	x = (KInput.getMouseX - (ScreenWidth() / 2)) * 4;
	y = (KInput.getMouseY - (ScreenHeight() / 2)) * 4;
	*/
	
	return {
		x: KInput.getMouseX,
		y: KInput.getMouseY
	}
	
	//if (gwin->hasFocus()) KInput::mousePointerTo(ScreenWidth() / 2, ScreenHeight() / 2);
}
	
function AccelerateMouseMickeys(x, y, scale, scale_accel)
{
	var dist;
	
	scale = scale * 0.015;
	scale_accel = (scale_accel * 0.01) + 1.0;
	
	dist = x * x + y * y;
	
	// Acceleration Threshold 1
	if (dist > 7*7)
	{
		x *= (scale_accel * 0.8); // Scale movements.
		y *= (scale_accel * 0.8);
	}
	
	// Acceleration Threshold 2
	if (dist > 16*16)
	{
		x *= scale_accel; // Scale movements.
		y *= scale_accel;  
	}
	
	// Scale overall speed (while stopping scale being so low that movement is stopped).
	if (x > 0) x = MAX(0.1, x * scale);
	if (x < 0) x = MIN(-0.1, x * scale);
	
	if (y > 0) y = MAX(0.1, y * scale);
	if (y < 0) y = MIN(-0.1, y * scale);
	
}

function FileSize(FileName) {
	var file;

	if (!stat(FileName, file)) {
		return file.st_size;
	}

	return 0;
}


function BlitTransform(bmp, x, y, w, h, angle, alpha) 
{
 var width, height;
 var zoom;
 
 width = bmp.width;
 height = bmp.height;

 // Different Width and Height.
 x -= (w / 2);
 y -= (h / 2);

 // need -1 for dx2 and dy2 in directX, but not in OpenGL! PTK bug..
 bmp.stretchAlphaRect( 0, 0, width, height, x, y, (x + w) - (1 - game.opengl), (y + h) - (1 - game.opengl), 
 alpha, 360.0 - RAD_TO_DEG( angle ));

 return;
}


function SetSolidColour(bmp, col)
{
 var texcols;

 bmp.setBlitColor(col.r, col.g, col.b, 1.0);

 if (game.opengl)
 {
  glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_BLEND);

  texcols[0] = col.r;
  texcols[1] = col.g;
  texcols[2] = col.b;
			
  glTexEnvfv(GL_TEXTURE_ENV, GL_TEXTURE_ENV_COLOR, texcols);
 }
 else
 {
  // Demo version of PTK doesn't allow D3D handle.. :'(

  //KGraphicD3D::_d3d->SetTextureStageState(0, D3DTSS_COLOROP, D3DTOP_SELECTARG2);
	//KGraphicD3D::_d3d->SetTextureStageState(0, D3DTSS_COLORARG2, D3DTA_DIFFUSE);
 }
}


function CancelSolidColour(bmp)
{
 var texcols;

 bmp.setBlitColor(1.0, 1.0, 1.0, 1.0);

 if (game.opengl)
 {	 
  texcols[0] = 1.0;
  texcols[1] = 1.0;
  texcols[2] = 1.0;

	glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_MODULATE);
	glTexEnvfv(GL_TEXTURE_ENV, GL_TEXTURE_ENV_COLOR, texcols);
 }
 else
 {
  //KGraphicD3D::_d3d->SetTextureStageState(0, D3DTSS_COLOROP, D3DTOP_MODULATE);
	//KGraphicD3D::_d3d->SetTextureStageState(0, D3DTSS_ALPHAOP, D3DTOP_MODULATE);
 }
}

function DrawShadedRect(x1, y1, x2, y2, c1, c2, c3, c4) {
	if (game.opengl) {
		glDisable(GL_TEXTURE_2D);
		glDisable(GL_BLEND);
		glShadeModel(GL_SMOOTH);

		glBegin(GL_TRIANGLE_STRIP);

		y1 = ScreenHeight() - y1;
		y2 = ScreenHeight() - y2;

		glColor4f(c3.r, c3.g, c3.b, c3.a);
		glVertex3f(x1, y2, 0);

		glColor4f(c1.r, c1.g, c1.b, c1.a);
		glVertex3f(x1, y1, 0);

		glColor4f(c4.r, c4.g, c4.b, c4.a);
		glVertex3f(x2, y2, 0);

		glColor4f(c2.r, c2.g, c2.b, c2.a);
		glVertex3f(x2, y1, 0);

		glEnd();

		glEnable(GL_TEXTURE_2D);
	}
}

function CheckGfxExists(g, file, line) {
	var txt;

	if (g > gfx.size()) {
		txt = sprintf("Gfx: %d in %s at line %d", g, file, line);
		MessageBox("Gfx number does not exist!", txt);
	}
}

/*
function slprintf(buffer, count, fmt)
{
	var ap;
	var ret;

	va_start(ap, fmt);
#if !defined __APPLE__	
	ret = _vsnprintf(buffer, count-1, fmt, ap);
#else
	ret = vsnprintf(buffer, count-1, fmt, ap);
#endif	
	if (ret < 0)
		buffer[count-1] = '\0';
	va_end(ap);
	return ret;

}*/

function drawRect( x1, y1, x2, y2, r, g, b, blend ){
	col = Rgba(r, g, b, blend);
	
	context.fillStyle = col.css;
	
	context.fillRect(x1,y1,x2,y2);
}

function drawLine( x1, y1, x2, y2, r, g, b, blend ){
	col = Rgba(r, g, b, blend);
	
	context.fillStyle = col.css;
	
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.stroke();
}

Element.prototype.setBlitColor = function( r, g, b, a ){
	if( r>1 || g>1 || b>1 || a>1 ){
		console.error('invalid colour value');
	}
	
	if( this.blitColor == r+g+b+a ){
		return;	
	}
	
	if( !this.bak ){
		this.bak = this.src;
	}else{
		this.src = this.bak;	
	}
	
	if( !this.cache ){
		this.cache = {};
	}else{
		if( this.cache[r+g+b+a] ){
			this.src = this.cache[r+g+b+a];
			return;
		}
	}
	
	var canvas = document.createElement("canvas");
	canvas.width = this.width;
	canvas.height = this.height;

	var ctx = canvas.getContext("2d");
	
	ctx.drawImage( this, 0, 0 );

	var imgd = ctx.getImageData( 0, 0, canvas.width, canvas.height );
	var pixels = imgd.data;
	
	for (var i = 0, n = pixels.length; i < n; i += 4) {
		pixels[i] = parseInt(pixels[i]*r);   // red
		pixels[i+1] = parseInt(pixels[i+1]*g);   // green
		pixels[i+2] = parseInt(pixels[i+2]*b);   // blue
		pixels[i+3] = parseInt(pixels[i+3]*a); // alpha
	}
	
	ctx.putImageData(imgd, 0, 0);
	
	this.src = canvas.toDataURL();
	this.cache[r+g+b+a] = this.src;
	
	this.blitColor = r+g+b+a;
};

Element.prototype.stretchAlphaRect = function( sx1, sy1, sx2, sy2, dx1, dy1 , dx2 , dy2 ) {
	context.drawImage(this, sx1, sy1, sx2-sx1, sy2-sy1, dx1, dy1, dx2-dx1, dy2-dy1 );
};

Element.prototype.blitAlphaRectFx = function( x1, y1, x2, y2, destX, destY, angle, zoom, blend, flipx, flipy ){
	//context.globalAlpha = blend;
	context.drawImage(this, x1, y1, x2-x1, y2-y1, destX, destY, x2-x1, y2-y1 );
}
