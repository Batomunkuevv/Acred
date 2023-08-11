import imagemin, { optipng } from "gulp-imagemin";
import imageminJpegRecompress from "imagemin-jpeg-recompress";
import imageminSvgo from "imagemin-svgo";
import imageminPngquant from "imagemin-pngquant";
import imageminJpegtran from "imagemin-jpegtran";

export const images = () => {
    return app.gulp
        .src(app.path.src.images)
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: "IMAGES",
                    message: "Error: <%= error.message %>",
                })
            )
        )

        .pipe(app.plugins.newer(app.path.build.images))

        .pipe(
            app.plugins.if(
                app.isBuild,
                imagemin(
                    [
                        imageminJpegRecompress({ method: "smallfry", loops: 5, min: 65, max: 70, quality: "medium" }),
                        imageminJpegtran({ progressive: true }),
                        imageminSvgo({
                            plugins: [{ removeDimensions: true }, { removeAttrs: true }, { removeElementsByAttr: true }, { removeStyleElement: true }, { removeViewBox: false }],
                        }),
                        imageminPngquant({ quality: [0.65, 0.7], speed: 5 }),
                        optipng({ optimizationLevel: 3 }),
                    ],
                    { verbose: true }
                )
            )
        )

        .pipe(app.plugins.if(app.isBuild, app.plugins.newer(app.path.build.images)))

        .pipe(app.gulp.dest(app.path.build.images))
        .pipe(app.gulp.src(app.path.src.svg))
        .pipe(app.gulp.dest(app.path.build.images))
        .pipe(app.plugins.browserSync.stream());
};
