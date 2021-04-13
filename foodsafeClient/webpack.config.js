const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    module:{
        rules:[
            {
                test:/\.html$/i,
                use:[
                    {
                        loader:"html-loader",
                        options:{minimize:true}
                    }
                ]
            }
        ]
    },
    node:{
        fs:"empty"
    },
    plugins: [
        new HtmlWebPackPlugin({
            template:"./src/index.html",
            filename:"./index.html"
        })
    ]
}