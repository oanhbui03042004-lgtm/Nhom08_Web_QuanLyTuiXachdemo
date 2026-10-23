using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Nhom08_Web_QuanLyTuiXach.Controllers
{
    public class ProductsController : Controller
    {
        // GET: Products
        public ActionResult Index()
        {
            return View();
        }

        // GET: Products/Detail?id=3
        public ActionResult Detail(int id)
        {
            ViewBag.ProductId = id;

            return View();
        }
    }
}