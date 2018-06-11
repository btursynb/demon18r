using SmartSite.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace SmartSite.Controllers
{
    public class UserScriptController : Controller
    {
        // GET: UserScript. Returns html and js for widget
       
        [HttpGet]
        public JsonpResult Index(string authcode)
        {
            // Open widgets js and html
            var fileStream = new FileStream(Server.MapPath("~/Content/Widget/htmlwidget1.html"), FileMode.Open, FileAccess.Read, FileShare.Read);
            var textReader = new StreamReader(fileStream);
            // Fill authcode variable in generated client js with requested authcode. For now user id used as authcode.
            var content = Regex.Replace(textReader.ReadToEnd(), "(stringtoreplace)", authcode);
            fileStream.Close();
            textReader.Close();
            JsonpResult result = new JsonpResult(content);
            // following piece of code is more elequant, however could be thread unsafe and probably may lock file from concurrent access
            // var fileContents = Regex.Replace(System.IO.File.ReadAllText(Server.MapPath("~/Content/Widget/htmlwidget1.html")), "(stringtoreplace)", authcode);
            //JsonpResult result = new JsonpResult(fileContents); 
            return result;
        }
    }
}