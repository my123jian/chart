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