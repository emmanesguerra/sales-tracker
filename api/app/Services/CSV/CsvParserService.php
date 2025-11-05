<?php

namespace App\Services\CSV;

use Exception;

class CsvParserService
{
    public function process(string $filePath): array
    {
        $parsedData = [];

        if (($handle = fopen($filePath, 'r')) !== false) {
            $header = fgetcsv($handle);

            // Trim whitespace and normalize header names
            $header = array_map(fn($h) => trim($h), $header);

            while (($row = fgetcsv($handle)) !== false) {
                // Trim values
                $row = array_map(fn($value) => trim($value), $row);

                $record = array_combine($header, $row);
                $parsedData[] = $record;
            }

            fclose($handle);
        } else {
            throw new \Exception('Failed to open CSV file for reading');
        }

        return $parsedData;
    }
}
