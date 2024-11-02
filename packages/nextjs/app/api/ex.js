function main(data) {
  try {
    const streamData = data.streamData;
    const filteredReceipts = [];
    const topicHashes = [
      "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
      "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
    ];

    streamData.forEach(receipt => {
      const relevantLogs = receipt.logs.filter(log => topicHashes.includes(log.topics[0]));
      if (relevantLogs.length > 0) {
        filteredReceipts.push(receipt);
      }
    });

    if (filteredReceipts.length === 0) {
      return null;
    }

    return {
      filteredReceipts,
    };
  } catch (e) {
    return { error: e.message };
  }
}
