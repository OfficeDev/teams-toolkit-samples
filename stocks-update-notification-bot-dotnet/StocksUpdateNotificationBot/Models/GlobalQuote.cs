namespace StocksUpdateNotificationBot.Models
{
    public class GlobalQuote
    {
        public string Symbol { get; set; }

        public double Open { get; set; }

        public double High { get; set; }

        public double Low { get; set; }

        public double Price { get; set; }

        public double Volume { get; set; }

        public string LatestTradingDay { get; set; }

        public double PreviousClose { get; set; }

        public double Change { get; set; }

        public double ChangePercent { get; set; }

        public string Name { get; set; }

        public string Timestamp { get; set; }
    }

}