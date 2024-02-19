// webpack.config.js

module.exports = {
    module: {
        rules: [
            {
                test: /\.(mp3)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192, // Bytesize-Grenze für die Base64-Konvertierung
                        fallback: 'file-loader',
                        outputPath: 'assets/sounds/' // Ausgabepfad für die Sounddateien
                    }
                }
            }
        ]
    }
};
