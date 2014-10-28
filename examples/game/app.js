﻿/// <reference path="../../src/bobril.d.ts"/>
var GameApp;
(function (GameApp) {
    function h(tag) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        return { tag: tag, children: args };
    }

    var Player = (function () {
        function Player() {
            this.x = 350 - 20;
            this.y = 480;
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = 0;
        }
        Player.prototype.tick = function () {
            if (this.left == this.right)
                this.ax = 0;
            else if (this.left)
                this.ax = -1;
            else
                this.ax = 1;
            if (this.up == this.down)
                this.ay = 0;
            else if (this.up)
                this.ay = -1;
            else
                this.ay = 1;

            if (this.ax < this.vx) {
                this.vx -= 0.1;
            } else if (this.ax > this.vx) {
                this.vx += 0.1;
            }
            if (Math.abs(this.vx) < 0.05)
                this.vx = 0;
            this.x += 10 * this.vx;
            if (this.x > 700 - 50)
                this.x = 700 - 50;
            if (this.x < 10)
                this.x = 10;

            if (this.ay < this.vy) {
                this.vy -= 0.1;
            } else if (this.ay > this.vy) {
                this.vy += 0.1;
            }
            if (Math.abs(this.vy) < 0.05)
                this.vy = 0;
            this.y += 10 * this.vy;
            if (this.y > 480)
                this.y = 480;
            if (this.y < 70)
                this.y = 70;
            if (true) {
                shootParticles.push(new ShootParticle(this.x + 20, this.y - 40, 0.5 - Math.random(), -10 + this.vy));
            }
        };
        Player.prototype.toVg = function () {
            function getPlayerPath(x, y) {
                return ["M", x, y, "C", x, y - 20, x + 15, y - 10, x + 20, y - 50, "C", x + 25, y - 10, x + 40, y - 20, x + 40, y, "L", x, y];
            }
            return {
                data: {
                    path: getPlayerPath(this.x, this.y),
                    stroke: "#000000",
                    fill: "#fff000",
                    strokeWidth: 2
                }
            };
        };
        return Player;
    })();

    var ShootParticle = (function () {
        function ShootParticle(x, y, vx, vy) {
            this.x = x + vx;
            this.y = y + vy;
            this.vx = vx;
            this.vy = vy;
        }
        ShootParticle.prototype.tick = function () {
            this.y += this.vy;
            this.x += this.vx;
            this.vy *= 0.995;
            this.vx *= 0.995;
        };
        ShootParticle.prototype.dead = function () {
            return this.y < -10 || this.x < -10 || this.y > 510 || this.x > 710;
        };
        ShootParticle.prototype.toVg = function () {
            return {
                data: {
                    path: ["M", this.x, this.y, "L", this.x - this.vx, this.y - this.vy],
                    stroke: "#ff4040",
                    strokeWidth: 1
                }
            };
        };
        return ShootParticle;
    })();

    var player = new Player();
    var shootParticles = [];

    var GameControler = (function () {
        function GameControler() {
        }
        GameControler.init = function (ctx, me) {
            ctx.time = b.uptime();
        };

        GameControler.update = function (ctx, me, oldMe) {
            var a = b.uptime();
            while (a > ctx.time) {
                player.tick();
                for (var i = 0; i < shootParticles.length; i++) {
                    var p = shootParticles[i];
                    p.tick();
                    if (p.dead()) {
                        shootParticles.splice(i, 1);
                        i--;
                    }
                }
                ctx.time += 20;
            }
        };

        GameControler.postInitDom = function (ctx, me, element) {
            element.focus();
        };

        GameControler.onKeyDown = function (ctx, event) {
            if (event.which == 37) {
                player.left = true;
                return true;
            } else if (event.which == 39) {
                player.right = true;
                return true;
            } else if (event.which == 38) {
                player.up = true;
                return true;
            } else if (event.which == 40) {
                player.down = true;
                return true;
            }
            return false;
        };

        GameControler.onKeyUp = function (ctx, event) {
            if (event.which == 37) {
                player.left = false;
                return true;
            } else if (event.which == 39) {
                player.right = false;
                return true;
            } else if (event.which == 38) {
                player.up = false;
                return true;
            } else if (event.which == 40) {
                player.down = false;
                return true;
            }
            return false;
        };
        return GameControler;
    })();

    b.init(function () {
        b.invalidate();
        var frame = ["M", 0, 0, "L", 700, 0, "L", 700, 500, "L", 0, 500, "Z"];
        return [
            h("h1", "Game"),
            {
                tag: "div", attrs: { tabindex: "0", style: { width: "700px", height: "500px", outline: "0" } }, component: GameControler, children: [
                    {
                        component: b.vg,
                        data: { width: "700px", height: "500px" },
                        children: [
                            { data: { path: frame, stroke: "#808080", strokeWidth: 2 } },
                            player.toVg(),
                            shootParticles.map(function (p) {
                                return p.toVg();
                            })
                        ]
                    }
                ]
            }
        ];
    });
})(GameApp || (GameApp = {}));
//# sourceMappingURL=app.js.map