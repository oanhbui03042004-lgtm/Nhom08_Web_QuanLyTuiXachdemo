using MaisoneMVC;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
// Bỏ dòng namespace MaisoneMVC thừa nếu không cần thiết, giữ nguyên các namespace chuẩn của bạn

namespace Nhom08_Web_QuanLyTuiXach
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            // Thêm dòng kích hoạt BundleConfig này vào đây để nạp CSS/JS
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}