using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using SmartSite.Models;
using Microsoft.AspNet.Identity;
using System.IO;

namespace SmartSite.Controllers
{
    [Authorize]
    public class ActionsController : Controller
    {
        private SmartSite.Models.SmartSite db = new SmartSite.Models.SmartSite();

        // GET: Actions
        public async Task<ActionResult> Index()
        {
            // change this to normal
            int sitetype = 1;
            var userId = User.Identity.GetUserId();
            var userInfo = await db.GeneralInfo.FirstOrDefaultAsync(x => x.UserId == userId);
            ViewBag.userInfo = userInfo;
            var userActionEntries = db.UserToAction.Where(x => x.UserId == userId);
            ViewBag.scriptText = readFile(userId);
            List<PlanToActions> availableActionEntries = await db.PlanToActions.Where(x => x.SiteType == sitetype).ToListAsync();

            List<string> siteThemesList = new List<string>();
            foreach (UserToAction uta in userActionEntries)
            {
                if (!siteThemesList.Contains(uta.PlanToActions.SiteTheme1.SiteTheme1))
                {
                    siteThemesList.Add(uta.PlanToActions.SiteTheme1.SiteTheme1);
                }
            }
            var availableActionsSiteThemes = db.SiteTheme.Where(x => x.SiteType == sitetype);
            ViewBag.availableActionsSiteThemes = await availableActionsSiteThemes.ToListAsync();
            ViewBag.siteThemesList = siteThemesList;
            

            return View(await userActionEntries.ToListAsync());
        }
        [HttpPost]
        public async Task<ActionResult> GetAvailableActionsByTheme(long themeId)
        {
            var availableActions = db.Actions.Where(x => x.ActionType1.SiteTheme == themeId);
            if (availableActions != null)
            {
                var userId = User.Identity.GetUserId();
                var userToActions = db.UserToAction.Where(x => x.AspNetUsers.Id == userId).ToList();
                List<Actions> actions = new List<Actions>();
                foreach (UserToAction uta in userToActions)
                {
                    actions.Add(uta.PlanToActions.Actions);
                }
                SelectList sl = new SelectList(availableActions, "ActionId", "ActionParameter");
                IList<SelectListItem> items = new List<SelectListItem>();
                foreach (var item in sl)
                {
                    if (actions.Where(x => x.ActionId.ToString() == item.Value).FirstOrDefault() != null)
                    {
                        items.Add(new SelectListItem { Text = item.Text, Value = "e" + item.Value });
                    }
                    else
                    {
                        items.Add(new SelectListItem { Text = item.Text, Value = "d" + item.Value });
                    }
                }
                
                return Json(new SelectList(items, "Value", "Text"));
            }
            //var result = new SelectList(actionTypes, "Id", "ActionType1");
            //return Json(result);
            return Json("");
        }
        private string readFile(string authcode)
        {
            // Open script for prepared for user
            var fileStream = new FileStream(Server.MapPath("~/Content/Widget/scriptforuser.html"), FileMode.Open, FileAccess.Read, FileShare.Read);
            var textReader = new StreamReader(fileStream);
            // Fill authcode variable in generated client js with requested authcode. For now user id used as authcode.
            var content = System.Text.RegularExpressions.Regex.Replace(textReader.ReadToEnd(), "(authcodetoreplace)", authcode);
            fileStream.Close();
            textReader.Close();
            return content;
        }
        [HttpPost]
        public async Task<ActionResult> Update(IEnumerable<UserToAction> utaList)
        {
            foreach (UserToAction uta in utaList)
            {
                var record = await db.UserToAction.FindAsync(uta.Id);
                if (record != null)
                {
                    record.BaseURLVariable = uta.BaseURLVariable;
                    record.ParameterVariable = uta.ParameterVariable;
                }
            }
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }
        [HttpPost]
        public async Task<ActionResult> AddNewActions(long checkedId)
        {
            if (!ModelState.IsValid)
            {
                return Json("");
            }

            var userId = User.Identity.GetUserId();
            var utaExisting = db.UserToAction.Where(x => x.PlanToActions.Actions.ActionId == checkedId).FirstOrDefault();
            if (utaExisting != null)
            {
                db.UserToAction.Remove(utaExisting);
            }
            else { 
                UserToAction uta = new UserToAction();
                uta.UserId = userId;
                var geTask = await db.GeneralInfo.Where(x => x.AspNetUsers.Id == userId).FirstOrDefaultAsync();
                uta.BaseURLVariable = geTask.Website;
                uta.PlanToActions = await db.PlanToActions.Where(x => x.ActionParameter == checkedId).FirstOrDefaultAsync();
                if (uta.PlanToActions != null)
                {
                    db.UserToAction.Add(uta);
                }
            }
            await db.SaveChangesAsync();

            var userActionEntries = db.UserToAction.Where(x => x.UserId == userId);
            List<PlanToActions> availableActionEntries = await db.PlanToActions.Where(x => x.SiteType == 1).ToListAsync();
            List<string> siteThemesList = new List<string>();
            foreach (UserToAction uta in userActionEntries)
            {
                if (!siteThemesList.Contains(uta.PlanToActions.SiteTheme1.SiteTheme1))
                {
                    siteThemesList.Add(uta.PlanToActions.SiteTheme1.SiteTheme1);
                }
            }
            ViewBag.siteThemesList = siteThemesList;
            return PartialView("~/Views/Shared/Actions/_ActionsPage.cshtml", await userActionEntries.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult> ShowActions()
        {
            var userId = User.Identity.GetUserId();
            var userActionEntries = db.UserToAction.Where(x => x.UserId == userId);
            List<string> siteThemesList = await userActionEntries.GroupBy(x => x.PlanToActions.SiteTheme1.SiteTheme1).Select(g => g.Key).ToListAsync();
            //foreach (UserToAction uta in userActionEntries)
            //{
            //    if (!siteThemesList.Contains(uta.PlanToActions.SiteTheme1.SiteTheme1))
            //    {
            //        siteThemesList.Add(uta.PlanToActions.SiteTheme1.SiteTheme1);
            //    }
            //}
            ViewBag.siteThemesList = siteThemesList;
            return PartialView("~/Views/Shared/Actions/_ActionsPage.cshtml", await userActionEntries.ToListAsync());
        }
        // GET: Actions/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserToAction uta = await db.UserToAction.FindAsync(id);
            if (uta == null)
            {
                return HttpNotFound();
            }
            db.UserToAction.Remove(uta);
            await db.SaveChangesAsync();
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
    }
}
