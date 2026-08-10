import React from 'react';

import log4javascript from 'log4javascript';

window.log = window.log4javascript = log4javascript;

export const Logger = () => {
    const ln = () => {
        var url = '';
        var e = new Error();
        if (!e.stack)
            try {
                // IE requires the Error to actually be throw or else the Error's 'stack'
                // property is undefined.
                throw e;
            } catch (e) {
                if (!e.stack) {
                    return 0; // IE < 10, likely
                }
            }
        var stack = e.stack.toString().split(/\r\n|\n/);
        // We want our caller's frame. It's index into |stack| depends on the
        // browser and browser version, so we need to search for the second frame:
        //var frameRE = /:(\d+):(?:\d+)[^\d]*$/;
        var frameRE = /^(?:\w+\:\/\/)?([^\/]+)(.*)$/;
        do {
            var frame = stack.shift();
            if (frameRE.exec(frame) !== null) {
                url = 'http:' + frameRE.exec(frame)[2];
            }
        } while (stack.length);
        return url.substr(
            url.lastIndexOf('/') + 1,
            url.lastIndexOf(')') - url.lastIndexOf('/') - 1
        );
    };

    const verboseLevel = (level, arg) => {
        var debugLevel;

        if (
            typeof window.log4javascript != 'undefined' &&
            window.log4javascript != null
        ) {
            switch (level) {
                case 'all':
                    debugLevel = window.log4javascript.Level.ALL;
                    break;
                case 'trace':
                    debugLevel = window.log4javascript.Level.TRACE;
                    break;
                case 'debug':
                    debugLevel = window.log4javascript.Level.DEBUG;
                    break;
                case 'info':
                    debugLevel = window.log4javascript.Level.INFO;
                    break;
                case 'warn':
                    debugLevel = window.log4javascript.Level.WARN;
                    break;
                case 'error':
                    debugLevel = window.log4javascript.Level.ERROR;
                    break;
                case 'fatal':
                    debugLevel = window.log4javascript.Level.FATAL;
                    break;
                case 'off':
                    debugLevel = window.log4javascript.Level.OFF;
                    break;
                default:
                    debugLevel = window.log4javascript.Level.WARN;
                    break;
            }

            if (arg !== undefined && arg !== null) {
                arg.removeAllAppenders();
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(debugLevel);

                arg.setLevel(debugLevel);
                arg.addAppender(appender);
            } else {
                for (var key in window.logger) {
                    if (key !== undefined && key !== null) {
                        var loggerObject = window.logger[key];
                        if (loggerObject !== undefined && loggerObject !== null) {
                            loggerObject.removeAllAppenders();
                            var layout = new window.log4javascript.PatternLayout(
                                '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                            );
                            layout.setCustomField('line', ln);

                            var appender = new window.log4javascript.BrowserConsoleAppender();
                            appender.setLayout(layout);
                            appender.setThreshold(debugLevel);

                            loggerObject.setLevel(debugLevel);
                            loggerObject.addAppender(appender);
                        }
                    }
                }
            }
        }
    };

    const getLogger = () => {
        var defaultLog,
            transportLog,
            rtspLog,
            rtspStatusLog,
            mediaRouterLog,
            sessionLog,
            rtpClientLog,
            rtcpSessionLog,
            rtpSessionLog,
            mjpegrtpSessionLog,
            h264rtpSessionLog,
            h265rtpSessionLog,
            aacrtpSessionLog,
            g711rtpSessionLog,
            g726rtpSessionLog,
            metartpSessionLog,
            metaParserLog,
            playerLog,
            videoplayerLog,
            canvasplayerLog,
            canvasrendererLog,
            backupProviderLog,
            umpPlayerLog,
            streamManagerLog,
            statisticsLog,
            streamPlayerLog;

        if (
            typeof window.log4javascript != 'undefined' &&
            window.log4javascript != null
        ) {
            defaultLog = window.log4javascript.getLogger();
            transportLog = window.log4javascript.getLogger('transport');
            rtspLog = window.log4javascript.getLogger('rtsp');
            rtspStatusLog = window.log4javascript.getLogger('rtspstatus');
            mediaRouterLog = window.log4javascript.getLogger('router');
            rtpClientLog = window.log4javascript.getLogger('rtpclient');
            sessionLog = window.log4javascript.getLogger('session');
            rtcpSessionLog = window.log4javascript.getLogger('rtcpsession');
            rtpSessionLog = window.log4javascript.getLogger('rtpsession');
            mjpegrtpSessionLog = window.log4javascript.getLogger('mjpegrtpsession');
            h264rtpSessionLog = window.log4javascript.getLogger('h264rtpsession');
            h265rtpSessionLog = window.log4javascript.getLogger('h265rtpsession');
            aacrtpSessionLog = window.log4javascript.getLogger('aacrtpsession');
            g711rtpSessionLog = window.log4javascript.getLogger('g711rtpsession');
            g726rtpSessionLog = window.log4javascript.getLogger('g726rtpsession');
            metartpSessionLog = window.log4javascript.getLogger('metasession');
            metaParserLog = window.log4javascript.getLogger('meta:parser');
            playerLog = window.log4javascript.getLogger('player');
            videoplayerLog = window.log4javascript.getLogger('player:video');
            canvasplayerLog = window.log4javascript.getLogger('player:canvas');
            canvasrendererLog = window.log4javascript.getLogger(
                'player:canvas:renderer'
            );
            backupProviderLog = window.log4javascript.getLogger('backupprovider');
            umpPlayerLog = window.log4javascript.getLogger('ump-player');
            statisticsLog = window.log4javascript.getLogger('statistics');
            streamManagerLog = window.log4javascript.getLogger('streammanager');
            streamPlayerLog = window.log4javascript.getLogger('streamplayer');

            if (defaultLog !== null && defaultLog !== undefined) {
                // Create a PopUpAppender with default options
                //var appender = new window.log4javascript.PopUpAppender();

                // Create a Console Appender with default options
                var appender = new window.log4javascript.BrowserConsoleAppender();

                // Create a Layout
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                /* Use the method getLineNumber() as the value for the 0th custom field */
                layout.setCustomField('line', ln);
                appender.setLayout(layout);

                // Change the desired configuration options
                // popUpAppender.setReopenWhenClosed(true);
                // popUpAppender.setFocusPopUp(true);
                // popUpAppender.setNewestMessageAtTop(true);
                appender.setThreshold(window.log4javascript.Level.WARN);
                // Add the appender to the logger
                //log.addAppender(popUpAppender);

                defaultLog.setLevel(window.log4javascript.Level.WARN);
                defaultLog.addAppender(appender);
            }
            if (transportLog !== null && transportLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                transportLog.setLevel(window.log4javascript.Level.WARN);
                transportLog.addAppender(appender);
            }
            if (rtspLog !== null && rtspLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                rtspLog.setLevel(window.log4javascript.Level.WARN);
                rtspLog.addAppender(appender);
            }
            if (rtspStatusLog !== null && rtspStatusLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                rtspStatusLog.setLevel(window.log4javascript.Level.WARN);
                rtspStatusLog.addAppender(appender);
            }
            if (rtpClientLog !== null && rtpClientLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                rtpClientLog.setLevel(window.log4javascript.Level.WARN);
                rtpClientLog.addAppender(appender);
            }
            if (mediaRouterLog !== null && mediaRouterLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                mediaRouterLog.setLevel(window.log4javascript.Level.WARN);
                mediaRouterLog.addAppender(appender);
            }
            if (sessionLog !== null && sessionLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                sessionLog.setLevel(window.log4javascript.Level.WARN);
                sessionLog.addAppender(appender);
            }
            if (rtcpSessionLog !== null && rtcpSessionLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                rtcpSessionLog.setLevel(window.log4javascript.Level.WARN);
                rtcpSessionLog.addAppender(appender);
            }
            if (rtpSessionLog !== null && rtpSessionLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                rtpSessionLog.setLevel(window.log4javascript.Level.WARN);
                rtpSessionLog.addAppender(appender);
            }
            if (mjpegrtpSessionLog !== null && mjpegrtpSessionLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                mjpegrtpSessionLog.setLevel(window.log4javascript.Level.WARN);
                mjpegrtpSessionLog.addAppender(appender);
            }
            if (h264rtpSessionLog !== null && h264rtpSessionLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                h264rtpSessionLog.setLevel(window.log4javascript.Level.WARN);
                h264rtpSessionLog.addAppender(appender);
            }
            if (h265rtpSessionLog !== null && h265rtpSessionLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                h265rtpSessionLog.setLevel(window.log4javascript.Level.WARN);
                h265rtpSessionLog.addAppender(appender);
            }
            if (aacrtpSessionLog !== null && aacrtpSessionLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                aacrtpSessionLog.setLevel(window.log4javascript.Level.WARN);
                aacrtpSessionLog.addAppender(appender);
            }
            if (g711rtpSessionLog !== null && g711rtpSessionLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                g711rtpSessionLog.setLevel(window.log4javascript.Level.WARN);
                g711rtpSessionLog.addAppender(appender);
            }
            if (g726rtpSessionLog !== null && g726rtpSessionLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                g726rtpSessionLog.setLevel(window.log4javascript.Level.WARN);
                g726rtpSessionLog.addAppender(appender);
            }
            if (playerLog !== null && playerLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                playerLog.setLevel(window.log4javascript.Level.WARN);
                playerLog.addAppender(appender);
            }
            if (videoplayerLog !== null && videoplayerLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                videoplayerLog.setLevel(window.log4javascript.Level.WARN);
                videoplayerLog.addAppender(appender);
            }
            if (canvasplayerLog !== null && canvasplayerLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                canvasplayerLog.setLevel(window.log4javascript.Level.WARN);
                canvasplayerLog.addAppender(appender);
            }
            if (canvasrendererLog !== null && canvasrendererLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                canvasrendererLog.setLevel(window.log4javascript.Level.WARN);
                canvasrendererLog.addAppender(appender);
            }
            if (metartpSessionLog !== null && metartpSessionLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                metartpSessionLog.setLevel(window.log4javascript.Level.WARN);
                metartpSessionLog.addAppender(appender);
            }
            if (metaParserLog !== null && metaParserLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                metaParserLog.setLevel(window.log4javascript.Level.WARN);
                metaParserLog.addAppender(appender);
            }
            if (backupProviderLog !== null && backupProviderLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                backupProviderLog.setLevel(window.log4javascript.Level.WARN);
                backupProviderLog.addAppender(appender);
            }
            if (umpPlayerLog !== null && umpPlayerLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                umpPlayerLog.setLevel(window.log4javascript.Level.WARN);
                umpPlayerLog.addAppender(appender);
            }
            if (statisticsLog !== null && statisticsLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                statisticsLog.setLevel(window.log4javascript.Level.WARN);
                statisticsLog.addAppender(appender);
            }
            if (streamManagerLog !== null && streamManagerLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                streamManagerLog.setLevel(window.log4javascript.Level.WARN);
                streamManagerLog.addAppender(appender);
            }
            if (streamPlayerLog !== null && streamPlayerLog !== undefined) {
                var layout = new window.log4javascript.PatternLayout(
                    '[Line#%f] %d{MMM dd yyyy HH:mm:ss} %-5p - %m%n'
                );
                layout.setCustomField('line', ln);

                var appender = new window.log4javascript.BrowserConsoleAppender();
                appender.setLayout(layout);
                appender.setThreshold(window.log4javascript.Level.WARN);

                streamPlayerLog.setLevel(window.log4javascript.Level.WARN);
                streamPlayerLog.addAppender(appender);
            }
        }

        return {
            default: defaultLog,
            transport: transportLog,
            rtsp: rtspLog,
            rtspstatus: rtspStatusLog,
            rtp: rtpClientLog,
            router: mediaRouterLog,
            session: sessionLog,
            rtcp: rtcpSessionLog,
            mjpeg: mjpegrtpSessionLog,
            h264: h264rtpSessionLog,
            h265: h265rtpSessionLog,
            aac: aacrtpSessionLog,
            g711: g711rtpSessionLog,
            g726: g726rtpSessionLog,
            metasession: metartpSessionLog,
            meta: metaParserLog,
            player: playerLog,
            video: videoplayerLog,
            canvas: canvasplayerLog,
            renderer: canvasrendererLog,
            backup: backupProviderLog,
            ump: umpPlayerLog,
            statistics: statisticsLog,
            manager: streamManagerLog,
            stream: streamPlayerLog,
        };
    };
};
