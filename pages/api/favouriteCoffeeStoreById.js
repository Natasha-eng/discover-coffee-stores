import {
  table,
  findRecordByFilter,
  getMinifiedRecords,
} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];

          const calculateVoting = parseInt(record.voting) + parseInt(1);

          //update a record
          const updatedRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updatedRecord) {
            const minifiedRecords = getMinifiedRecords(updatedRecord);
            res.json(minifiedRecords);
          }
        } else {
          res.json({ message: "Coffee store id does not exist", id });
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: "Error upvoting coffee store", error });
    }
  }
};

export default favouriteCoffeeStoreById;
