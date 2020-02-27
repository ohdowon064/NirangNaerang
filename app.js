/**
 * 1. 서버
 * 2. 데이터 베이스
 * 
 * 1. 서버
 *  - 
 * 
 * 2. 데이터베이스
 *  - 스키마
 *  - mongodb url 
 * mongodb+srv://NirangNaerang:1q2w3e4r@cluster0-fxhcv.gcp.mongodb.net/test?retryWrites=true&w=majority
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(compression());
const router = express.Router();

let database;
let BoardSchema;
let BoardModel;

function createBoardSchema() {
    BoardSchema = mongoose.Schema(
        {
            id : {
                type : String,
                required : true
            },
            title : {
                type : String,
                required : true
            },
            location : {
                type : String,
                required : true
            },
            period : {
                type : String,
                required : true
            },
            cost : {
                type : Number,
                required : true
            },
            roomType : {
                type : String,
                required : true
            },
            phoneNumber : {
                type : String,
                required : true
            },
            // image : imageSchema
        },
        {
            timestamps : true
        }
    );
    console.log('BoardSchema 정의함.');

    BoardModel = mongoose.model("board", BoardSchema);
    console.log('board 정의함.');
}

function connectDB() {
    const databaseURL = 'mongodb+srv://root:1234@education-9l52i.gcp.mongodb.net/test?retryWrites=true&w=majority';

    console.log('디비 연결 시도');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseURL);

    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', () => {
        createBoardSchema();
    });
    database.on('disconnected', () => {
        console.log('연결이 끊어져 5초 후 다시 연결합니다.');
        setInterval(connectDB, 5000);
    })
}

// 글 생성
const createBoard = (database, id, title, location, period, cost, roomType, phoneNumber, callback) => {
    console.log(`createBoard 호출됨 : ${title}, ${title}, ${location}, ${location}, ${period}, ${roomType}, ${phoneNumber}`);

    let board = new BoardModel({"id" : id, "title" : title, "location" : location, "period" : period, "cost" : cost, "roomType" : roomType, "phoneNumber" : phoneNumber});

    board.save((err, createdBoard) => {
        console.log(createdBoard);
        if(err) {
            callback(err, null);
            return;
        }
        console.log('게시글 데이터 추가됨.');
        callback(null, createdBoard);
    });
}

// 게시글 작성
router.post('/create/board', (req, res) => {
    console.log('/create/board 호출');

    const paramId = req.param('id');
    const paramTitle = req.param('title');
    const paramLocation = req.param('location');
    const paramPeriod = req.param('period');
    const paramCost = req.param('cost');
    const paramRoomtype = req.param('roomtype');
    const paramPhoneNumber = req.param('phoneNumber');

    console.log(`현재 입력된 데이터 => ${paramId}, ${paramTitle}, ${paramLocation}, ${paramPeriod}, ${paramCost}, ${paramRoomtype}, ${pparamPhoneNumberaram} `);

    if(database) {
        createBoard(database, paramId, paramTitle, paramLocation, paramPeriod, paramCost, paramRoomtype, paramPhoneNumber, (err, createdBoard) => {
            if(err) throw err;
            
            if(createBoard) {
                res.json({status: true});
                console.log('추가 완료');
            }else {
                res.json({status : false});
                console.log('추가 실패');
            }
        })
    }else {
        res.json({status : false});
    }
});

// 내가 올린 글
router.post('/myboard', (req, res) => {
    console.log('/myboard 호출');

    const paramId = req.params('id');
    res.json(database.BoardModel.find({id : paramId}, {_id : false}));
});

// 내가 올린 글 수정
router.post('/update/board', (req, res) => {
    console.log('/update/board 호출');

    const paramId = req.params('id');
    const paramTitle = req.param('title');
    const paramLocation = req.param('location');
    const paramPeriod = req.param('period');
    const paramCost = req.param('cost');
    const paramRoomtype = req.param('roomtype');
    const paramPhoneNumber = req.param('phoneNumber');

    database.collection('myBoard').updateOne({id : paramId}, {$set : {'title' : paramTitle}});
    database.collection('myBoard').updateOne({id : paramId}, {$set : {'location' : paramLocation}});
    database.collection('myBoard').updateOne({id : paramId}, {$set : {'period' : paramPeriod}});
    database.collection('myBoard').updateOne({id : paramId}, {$set : {'cost' : paramCost}});
    database.collection('myBoard').updateOne({id : paramId}, {$set : {'roomtype' : paramRoomtype}});
    database.collection('myBoard').updateOne({id : paramId}, {$set : {'phoneNumber' : paramPhoneNumber}});

    console.log('수정 완료');
})

let findData;

// 메인화면 검색
router.post('/main/search', (req, res) => {
    console.log('/main/search 호출');

    const paramLocation = req.param('location');
    const paramPeriod = req.param('period');
    const paramCost = req.param('cost');
    const paramRoomtype = req.param('roomType');

    console.log(`찾는 정보 => ${paramLocation}, ${paramPeriod}, ${paramCost}, ${paramRoomtype}`);

    findData = database.BoardModel.find({location : paramLocation}, {period : paramPeriod}, {coost : paramCost}, {roomType : paramRoomtype},{_id:false});
    
    
});

// 리스트
router.post('/main/list', (req, res) => {
    console.log('main/list 호출');
    res.json(findData);
});

// 방 상세화면
router.post('/main/detail', (req, res) => {
    console.log('/main/detail 호출');
    res.json(findData);
});



app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        mongoose.connect(MONGODB_URL, { useNewUrlParser : true}, (err) => {
            if(err) {
                console.log(err);
            } else{ 
                console.log('Database is connected successfully');
            }
        });
    }
});