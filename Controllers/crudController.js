const catchAsync = require('../utilities/catchAsync')
const ApiFeatures = require('../utilities/apiFeatures')
exports.getResults = model =>
    catchAsync(async (req, res, next) => {
        //execute queries
        const features = new ApiFeatures(model.find().populate("reviews"), req.query)
            .filter()
            .sort()
            .limit()
            .pagination()

        const results = await features.query

        res.status(200).json({
            status: 'success',
            results: results.length,
            data: results
        });

    })


exports.addNew = model => catchAsync(async (req, res, next) => {

    if (req.files) {
        req.body.images = [];
        req.files.forEach((file, index) => {
            req.body.images.push(file.filename);
        });
    }
    const newData = await model.create(req.body)
    //   if(!req.userId) return res.json({message:'Unauthenticated'});
    console.log(newData);
    res.status(200).json({
        status: "success",
        data: newData
    })
})


exports.getSingleValue = model => catchAsync(async (req, res, next) => {

    const result = await model.findById(req.params.id).populate("reviews")
    res.status(200).json({
        status: 'success',
        data: result,
    })

})

exports.update = model => catchAsync(async (req, res, next) => {
    const updatedVal = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: updatedVal
    })

})

exports.delete = model => catchAsync(async (req, res) => {

    await model.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getCategory = (model, cateGory) =>
    catchAsync(async (req, res) => {

        const data = await model.aggregate([
            {
                $match: { category: cateGory }
                //$match:{ratingAverage :{$gt:3}}
            },
        ])

        console.log(cateGory)
        res.status(200).json({
            status: 'success',
            results: data.length,
            data
        })

    })

