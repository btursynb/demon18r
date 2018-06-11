using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using SmartSite.Models;
using System.Web.Http.Cors;

namespace SmartSite.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ActionParameterController : ApiController
    {
        private SmartSite.Models.SmartSite db = new SmartSite.Models.SmartSite();
        //api/ActionParameter/Get?
        public string Get(string authcode, string actionType, string action)
        {
            if (authcode == null || actionType == null || action == null)
            {
                return "There is an error with the request send. Please contact our support.";
            }
            actionType = actionType.Replace("_", " ").ToLower();
            var user = db.AspNetUsers.Find(authcode);
            if (user == null)
            {
                return "This website isn't registered in our service or it's account has been suspended.";
            }
            UserToAction uta = db.UserToAction.Where(u => u.UserId == authcode).Where(x => x.PlanToActions.ActionType1.ActionType1.ToLower() == actionType).Where(m => m.PlanToActions.Actions.ActionParameter == action).FirstOrDefault();
            if (uta != null)
            {
                string result = uta.BaseURLVariable + "/" + uta.ParameterVariable;
                return result;
            }
            else
                return "Parameter not found";
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserToActionExists(long id)
        {
            return db.UserToAction.Count(e => e.Id == id) > 0;
        }
    }
}