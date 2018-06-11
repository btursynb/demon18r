using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ClientsForDHS.Models;
using PagedList;

namespace ClientsForDHS.Controllers
{
    [Authorize]
    public class CompaniesController : Controller
    {
        private DHSEntities db = new DHSEntities();

        // GET: Companies
        public ActionResult Index(int? page)
        {
            var companies = db.Company.OrderBy(x => x.Id);
            if (Request.Cookies["SearchParams"] != null)
            {
                int cityToCategoryId  =int.Parse(Request.Cookies["searchParams"]["cityToCategoryId"]);
                companies = companies.Where(x => x.CityToCategory.Id == cityToCategoryId).OrderBy(x=>x.Id);
                ViewBag.currentFilter = db.CityToCategory.Where(x => x.Id == cityToCategoryId).FirstOrDefault();
                ViewBag.NumberOfInterested = companies.Where(x => x.IsInterested == true).Where(x=>x.CityToCategory.Id== cityToCategoryId).Count();
            }
            else
            {
                ViewBag.NumberOfInterested = companies.Where(x => x.IsInterested == true).Count();
            }
            
            int pageSize = 10;
            int pageNumber = (page ?? 1);
            
            
            return View(companies.ToPagedList(pageNumber, pageSize));
        }
        [HttpPost]
        public ActionResult setIsCompanyInterested(int companyId, bool value, int? page)
        {
            var company = db.Company.Where(x => x.Id == companyId).FirstOrDefault();
            if (company != null)
            {
                company.IsInterested = value;
                db.Entry(company).State = EntityState.Modified;
                db.SaveChanges();
                var interestedForToday = 0;
                var companies = db.Company.OrderBy(x => x.Id);
                if (Request.Cookies["SearchParams"] != null)
                {
                    int cityToCategoryId = int.Parse(Request.Cookies["searchParams"]["cityToCategoryId"]);
                    interestedForToday = companies.Where(x => x.IsInterested == true).Where(x => x.CityToCategory.Id == cityToCategoryId).Count();
                }
                else
                {
                    interestedForToday = companies.Where(x => x.IsInterested == true).Count();
                }
                return Json(new { company_system_id = company.SystemId, changedValue = value, interested = interestedForToday });
            }
            //return PartialView("Companies/ListOfCompanies", companies.ToPagedList(pageNumber, pageSize));
            return null;
        }
        // GET: Players/Details/5
        // GET: Companies/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Company company = db.Company.Find(id);
            if (company == null)
            {
                return HttpNotFound();
            }
            return View(company);
        }

        // GET: Companies/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Companies/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Name,Name_Ex_Primary,Name_Ex_Extension,Name_Ex_Description,Phone,City,Address,HasSite")] Company company)
        {
            if (ModelState.IsValid)
            {
                db.Company.Add(company);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(company);
        }

        // GET: Companies/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Company company = db.Company.Find(id);
            if (company == null)
            {
                return HttpNotFound();
            }
            return View(company);
        }

        // POST: Companies/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Name,Name_Ex_Primary,Name_Ex_Extension,Name_Ex_Description,Phone,City,Address,HasSite")] Company company)
        {
            if (ModelState.IsValid)
            {
                db.Entry(company).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(company);
        }

        // GET: Companies/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Company company = db.Company.Find(id);
            if (company == null)
            {
                return HttpNotFound();
            }
            return View(company);
        }

        // POST: Companies/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Company company = db.Company.Find(id);
            db.Company.Remove(company);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        public ActionResult Filter()
        {
            SearchViewModel s = new SearchViewModel();
            s.cities = db.City.ToList();
            s.parentCategories = db.CompanyCategories.ToList();
            s.childCategories = new List<CityToCategory>();
            return View(s);

        }
        [HttpPost]
        public ActionResult Filter(int childCategories)
        {
            SetCookie(childCategories);
            return RedirectToAction("Index", new { page = 1 });
        }
        public ActionResult FillCategories(int Category, int city)
        {
            //var childCategories = db.CityToCategory.Where(c => c.CityId == city).Where(c=>c.CompanyCategories.Id==Category).;
            var childCategories = (from a in db.CityToCategory where a.CityId == city && a.CompanyCategories.Id == Category && a.ParentId != null select new ChildCategory { Id = a.Id, Name = a.Name }).ToList();
            return Json(childCategories, JsonRequestBehavior.AllowGet);
        }
        public static void SetCookie(int categoryToCityId)
        {
            HttpCookie myCookie = new HttpCookie("SearchParams");
            myCookie["UserId"] = null;
            myCookie["cityToCategoryId"] = categoryToCityId.ToString();
            myCookie.Expires = DateTime.Now.AddDays(2);
            System.Web.HttpContext.Current.Response.Cookies.Add(myCookie);
        }
    }
}
