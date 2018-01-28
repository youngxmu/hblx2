fis.config.set('modules.postpackager', 'simple');
fis.config.set('settings.spriter.csssprites.margin', 20);
fis.config.set('roadmap.path', [{
    reg: '**.css',
    useSprite: true,
    useStandard : false
}]);


fis.config.merge({
    roadmap : {
        path : [
            {
                reg : /\/public\/css\/(.*\.css)/i,
                release : '/public/css/$1'
            },
            {
                reg : /\/public\/js\/(.*\.js)/i,
                release : '/public/js/$1'
            },
            {  
                reg : /\/public\/img\/(.*\.((jpg)|(png)|(gif)|(ico)))/i,
                release : '/public/img/$1'
            },
            {
                reg : /\/views\//i,
                useStandard : true
            },
            {
                reg : /\/(logs|test|node_modules)\//i,
                release : false
            },
            {
                reg : '**',
                useStandard : false,
                useOptimizer : false
            }
        ]
    },
    deploy : {
        nodeS1 : [
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                from : '/public',
                to : '/young/node/hblx2/public',
                subOnly : true
            },
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                from : '/public',
                to : '/young/static/hblx2',
                subOnly : true
            },
            {
                receiver : 'http://10.99.113.63:8999/receiver',
                from : '/public',
                to : '/young/static/hblx2',
                subOnly : true
            },
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                include : ['/views/**'],
                from : '/views',
                to : '/young/node/hblx2/views',
                subOnly : true,
                replace : {
                    from : 'http://10.99.13.128:8548',
                    to : 'http://act.cnhubei.com/hblx2'
                }
            }
        ],
        node1 : [
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                from : '/public',
                to : '/young/node/hblx2/public',
                subOnly : true
            },
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                from : '/public',
                to : '/young/static/hblx2',
                subOnly : true
            },
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                include : ['/views/**'],
                from : '/views',
                to : '/young/node/hblx2/views',
                subOnly : true,
                replace : {
                    from : 'http://10.99.13.128:8548',
                    to : 'http://act.cnhubei.com/hblx2'
                }
            },
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                include : ['/config/*.js'],
                from : '/config',
                to : '/young/node/hblx2/config',
                subOnly : true
            },
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                include : ['/lib/**'],
                from : '/lib',
                to : '/young/node/hblx2/lib',
                subOnly : true
            },
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                include : ['/routes/*.js'],
                from : '/routes',
                to : '/young/node/hblx2/routes',
                subOnly : true
            },
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                include : ['/models/**'],
                from : '/models',
                to : '/young/node/hblx2/models',
                subOnly : true
            },
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                include : ['app.js'],
                from : '/',
                to : '/young/node/hblx2',
                subOnly : true
            }
            ,
            {
                receiver : 'http://10.99.113.15:8999/receiver',
                include : ['route.js'],
                from : '/',
                to : '/young/node/hblx2',
                subOnly : true
            }
        ]
    }
});