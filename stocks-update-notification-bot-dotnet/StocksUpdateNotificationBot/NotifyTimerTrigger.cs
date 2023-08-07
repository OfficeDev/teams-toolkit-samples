using StocksUpdateNotificationBot.Models;
using AdaptiveCards.Templating;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Microsoft.TeamsFx.Conversation;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using ExecutionContext = Microsoft.Azure.WebJobs.ExecutionContext;

namespace StocksUpdateNotificationBot
{
    public sealed class NotifyTimerTrigger
    {
        private readonly ConversationBot _conversation;
        private readonly ILogger<NotifyTimerTrigger> _log;
        private readonly HttpClient _client = new();

        public NotifyTimerTrigger(ConversationBot conversation, ILogger<NotifyTimerTrigger> log)
        {
            _conversation = conversation;
            _log = log;
        }

        [FunctionName("NotifyTimerTrigger")]
        public async Task Run([TimerTrigger("*/30 * * * * *")] TimerInfo myTimer, ExecutionContext context, CancellationToken cancellationToken)
        {
            try
            {
                // Get quote data from Alpha Vantage API
                var response = await _client.GetStringAsync($"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo", cancellationToken);
                
                // Deserialize JSON response
                JObject jObj = (JObject)JsonConvert.DeserializeObject(response);


                // Transform Global Quote object
                var globalQuote = new GlobalQuote
                {
                    Symbol = jObj["Global Quote"]["01. symbol"].ToString(),
                    Open = double.Parse(jObj["Global Quote"]["02. open"].ToString()),
                    High = double.Parse(jObj["Global Quote"]["03. high"].ToString()),
                    Low = double.Parse(jObj["Global Quote"]["04. low"].ToString()),
                    Price = double.Parse(jObj["Global Quote"]["05. price"].ToString()),
                    Volume = double.Parse(jObj["Global Quote"]["06. volume"].ToString()),
                    LatestTradingDay = jObj["Global Quote"]["07. latest trading day"].ToString(),
                    PreviousClose = double.Parse(jObj["Global Quote"]["08. previous close"].ToString()),
                    Change = double.Parse(jObj["Global Quote"]["09. change"].ToString()),
                    ChangePercent = double.Parse(jObj["Global Quote"]["10. change percent"].ToString().Replace("%", string.Empty)),
                    Name = "Microsoft Corporation",
                    Timestamp = $"{DateTime.Now.ToUniversalTime().ToString("o").Split(".")[0]}Z"
                };

                // Read adaptive card template
                var adaptiveCardFilePath = Path.Combine(context.FunctionAppDirectory, "Resources", "NotificationDefault.json");
                var cardTemplate = await File.ReadAllTextAsync(adaptiveCardFilePath, cancellationToken);

                // Get bot installation
                var installations = new List<TeamsBotInstallation>();
                var pageSize = 100;
                string continuationToken = null;
                do
                {
                    var pagedInstallations = await _conversation.Notification.GetPagedInstallationsAsync(pageSize, continuationToken, cancellationToken);
                    continuationToken = pagedInstallations.ContinuationToken;
                    installations.AddRange(pagedInstallations.Data);
                } while (!string.IsNullOrEmpty(continuationToken));

                foreach (var installation in installations)
                {
                    // Build and send adaptive card
                    var cardContent = new AdaptiveCardTemplate(cardTemplate).Expand(globalQuote);
                    await installation.SendAdaptiveCard(JsonConvert.DeserializeObject(cardContent), cancellationToken);
                }
            }
            catch (HttpRequestException e)
            {
                _log.LogError(e.Message);
            }
        }
    }
}
