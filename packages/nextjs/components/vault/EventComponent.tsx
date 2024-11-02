import { useEffect, useState } from "react";
import { useScaffoldEventHistory, useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { Address } from "../scaffold-eth";

const EventComponent = () => {
  const [events, setEvents] = useState<any>([]);
  
  
  useScaffoldWatchContractEvent({
    contractName: "FlashVault",
    eventName: "TradeExecuted",
    onLogs: logs => {
      const newEvents = logs.map(log => ({
        id: log.logIndex,
        timestamp: new Date(Number(log.blockData.timestamp) * 1000).toLocaleString(),
        amount: (Number(log.args.net) / 1e6).toFixed(2),
        asset: log.args.tokenOut,
      }));

      setEvents((prevEvents: any) => [...newEvents, ...prevEvents]);
    },
  });


  const {
    data: historicArbitrageExecution,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "FlashVault",
    eventName: "TradeExecuted",
    fromBlock: 31231n,
    watch: true,
    filters: {  },
    blockData: true,
    transactionData: true,
    receiptData: true,
  });
  
  useEffect(() => {
    if (historicArbitrageExecution) {
      const mappedEvents = historicArbitrageExecution.map((event, index) => ({
        id: event.logIndex || index + 1,
        timestamp: new Date(Number(event.blockData.timestamp) * 1000).toLocaleString(),
        amount: (Number(event.args.net) / 1e6).toFixed(2), 
        asset: event.args.tokenOut,
      }));
      setEvents(mappedEvents);
    }
  }, [historicArbitrageExecution]);

  return (
    <div className="w-full mx-auto p-4 mt-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Events</h2>
        <p className="text-gray-500 text-center">Latest trades executed.</p>
        
        <div className="overflow-x-auto max-h-screen">
          <table className="w-full table-auto mt-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-sm font-semibold text-gray-600 w-1/4">Event ID</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600 w-1/4">Timestamp</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600 w-1/4">Net P/L USDC</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600 w-1/4">Asset</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: any) => (
                <tr key={event.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">{event.id}</td>
                  <td className="px-4 py-2 text-center">{event.timestamp}</td>
                  <td className="px-4 py-2 text-center">{event.amount}</td>
                  <td className="px-4 py-2 flex items-center justify-center">
                    <Address address={event.asset} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventComponent;
