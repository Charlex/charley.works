function Wave() {

    /** The current dimensions of the screen (updated on resize) */
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;

    var REVERSE = false;

    /** Wave settings */
    var DENSITY = .2;
    var FRICTION = 1.2;
    var MOUSE_PULL = 0.09; // The strength at which the mouse pulls particles within the AOE
    var AOE = 200; // Area of effect for mouse pull
    var DETAIL = Math.round( WIDTH / 50 ); // The number of particles used to build up the wave
    var WATER_DENSITY = 1.1;
    var AIR_DENSITY = 0.5;
    var TWITCH_INTERVAL = 150; // The interval between random impulses being inserted into the wave to keep it moving

    var mouseIsDown = false;
    var ms = {x:0, y:0}; // Mouse speed
    var mp = {x:0, y:0}; // Mouse position

    var canvas, context, particles;

    var timeUpdateInterval, twitchInterval;

    /**
     * Constructor.
     */
    this.Initialize = function( canvasID, reverse ) {
        REVERSE = reverse;
        canvas = document.getElementById( canvasID );

        if (canvas && canvas.getContext) {
            context = canvas.getContext('2d');

            particles = [];

            // Generate our wave particles
            for( var i = 0; i < DETAIL+1; i++ ) {
                particles.push( {
                    x: WIDTH / (DETAIL-4) * (i-2), // Pad by two particles on each side
                    y: HEIGHT*.9,
                    original: {x: 0, y: HEIGHT * .9},
                    velocity: {x: 0, y: Math.random()*3}, // Random for some initial movement in the wave
                    force: {x: -10, y: 0},
                    mass: 10
                } );
            }

            $(window).resize(ResizeCanvas);

            timeUpdateInterval = setInterval( TimeUpdate, 40 );
            twitchInterval = setInterval( Twitch, TWITCH_INTERVAL );

            ResizeCanvas();

        }
    };

    /**
     * Inserts a random impulse to keep the wave moving.
     * Impulses are only inserted if the mouse is not making
     * quick movements.
     */
    function Twitch() {
        if( ms.x < 6 || ms.y < 6 ) {
            var forceRange = 5; // -value to +value
            InsertImpulse( Math.random() * WIDTH, (Math.random()*(forceRange*2)-forceRange ) );
        }
    }

    /**
     * Inserts an impulse in the wave at a specific position.
     *
     * @param positionX the x coordinate where the impulse
     * should be inserted
     * @param forceY the force to insert
     */
    function InsertImpulse( positionX, forceY ) {
        var particle = particles[Math.round( positionX / WIDTH * particles.length )];

        if( particle ) {
            particle.force.y += forceY;
        }
    }

    /**
     *
     */
    function TimeUpdate(e) {

        context.clearRect(0, 0, WIDTH, HEIGHT);
        context.fillStyle = "#000";
        context.beginPath();
        context.moveTo(particles[0].x, particles[0].y);

        var len = particles.length;
        var i;

        var current, previous, next;

        for( i = 0; i < len; i++ ) {
            current = particles[i];
            previous = particles[i-1];
            next = particles[i+1];

            if (previous && next) {

                var forceY = 0;

                forceY += -DENSITY * ( previous.y - current.y );
                forceY += DENSITY * ( current.y - next.y );
                forceY += DENSITY/15 * ( current.y - current.original.y );

                current.velocity.y += - ( forceY / current.mass ) + current.force.y;
                current.velocity.y /= FRICTION;
                current.force.y /= FRICTION;
                current.y += current.velocity.y;

                var distance = DistanceBetween( mp, current );

                if( distance < AOE ) {
                    var distance = DistanceBetween( mp, {x:current.original.x, y:current.original.y} );

                    ms.x = ms.x * .98;
                    ms.y = ms.y * .98;

                    current.force.y += (MOUSE_PULL * ( 1 - (distance / AOE) )) * ms.y;
                }

                // cx, cy, ax, ay
                context.quadraticCurveTo(previous.x, previous.y, previous.x + (current.x - previous.x) / 2, previous.y + (current.y - previous.y) / 2);
            }

        }

        context.lineTo(particles[particles.length-1].x, particles[particles.length-1].y);
        if(REVERSE) {
            context.lineTo(WIDTH, 0);
            context.lineTo(0, 0);
        } else {
            context.lineTo(WIDTH, HEIGHT);
            context.lineTo(0, HEIGHT);
        }
        context.lineTo(particles[0].x, particles[0].y);

        context.fill();

        context.fillStyle = "#rgba(0,200,255,0)";
        context.beginPath();

        var b, p, d;

        context.fill();
    }

    /**
     *
     */
    function GetClosestParticle(point){
        var closestIndex = 0;
        var closestDistance = 1000;

        var len = particles.length;

        for( var i = 0; i < len; i++ ) {
            var thisDistance = DistanceBetween( particles[i], point );

            if( thisDistance < closestDistance ) {
                closestDistance = thisDistance;
                closestIndex = i;
            }

        }

        return particles[closestIndex];
    }

    /**
     *
     */
    function MouseMove(e) {
        ms.x = Math.max( Math.min( e.layerX - mp.x, 40 ), -40 );
        ms.y = Math.max( Math.min( e.layerY - mp.y, 40 ), -40 );

        mp.x = e.layerX;
        mp.y = e.layerY;

    }

    /**
     *
     */
    function ResizeCanvas(e) {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        for( var i = 0; i < DETAIL+1; i++ ) {
            particles[i].x = WIDTH / (DETAIL-4) * (i-2);
            particles[i].y = HEIGHT*.5;

            particles[i].original.x = particles[i].x;
            particles[i].original.y = particles[i].y;
        }
    }

    /**
     *
     */
    function DistanceBetween(p1,p2) {
        var dx = p2.x-p1.x;
        var dy = p2.y-p1.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

}

$(".section-break").each(function(i, e){
    var id = "section-break-" + i;
    $(this).html("<canvas></canvas>");
    $(this).attr("id", id);
    var reverse = $(this).attr("data-reverse");
    if(reverse == "true") { reverse = true; } else { reverse = false; }
    var canvas = $(this).find("canvas");
    $(canvas).attr("id", id + "-canvas");
    new Wave().Initialize( id + "-canvas", reverse );
});
