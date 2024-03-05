require("dotenv").config();
const configCors = (app) => {
    app.use(function (req, res, next) {
        // Cho phép truy cập từ tất cả các nguồn (*)
        res.setHeader('Access-Control-Allow-Origin', process.env.REACT_URL);
        // Cho phép sử dụng các phương thức GET, POST, OPTIONS
        res.setHeader('Access-Control-Allow-Methods', "GET,HEAD,PUT,PATCH,POST,DELETE");
        // Cho phép sử dụng các tiêu đề sau
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        // Cho phép cookie được chuyển đổi
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Nếu phương thức yêu cầu là OPTIONS, trả về một phản hồi ngắn và kết thúc middleware
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            // Nếu không phải là phương thức OPTIONS, tiếp tục xử lý yêu cầu
            next();
        }
    });

}
export default configCors;