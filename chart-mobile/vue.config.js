module.exports = {

    /*在这里配置多页面*/
    pages: {
        qxdc: {
// entry for the page
            entry: 'src/pages/qxdc/qxdc.js',
// the source template
            template: 'public/qxdc.html',
// output as dist/index.html
            filename: 'qxdc.html',
// when using title option,
// template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: '迁徙洞察'
        },
        tqfx: {
// entry for the page
            entry: 'src/pages/tqfx/tqfx.js',
// the source template
            template: 'public/tqfx.html',
// output as dist/index.html
            filename: 'tqfx.html',
// when using title option,
// template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: '通勤分析'
        },
        zzfx: {
// entry for the page
            entry: 'src/pages/zzfx/zzfx.js',
// the source template
            template: 'public/zzfx.html',
// output as dist/index.html
            filename: 'zzfx.html',
// when using title option,
// template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: '职住分析'
        },
        kstq: {
// entry for the page
            entry: 'src/pages/kstq/kstq.js',
// the source template
            template: 'public/kstq.html',
// output as dist/index.html
            filename: 'kstq.html',
// when using title option,
// template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: '跨市通勤'
        },
        index: {
// entry for the page
            entry: 'src/pages/index/main.js',
// the source template
            template: 'public/index.html',
// output as dist/index.html
            filename: 'index.html',
// when using title option,
// template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: '迁徙洞察'
        },
    }
}