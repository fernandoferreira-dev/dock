`timescale 1ns / 1ps
//////////////////////////////////////////////////////////////////////////////////
// Company: 
// Engineer: 
// 
// Create Date:    08:46:45 04/08/2026 
// Design Name: 
// Module Name:    counter 
// Project Name: 
// Target Devices: 
// Tool versions: 
// Description: 
//
// Dependencies: 
//
// Revision: 
// Revision 0.01 - File Created
// Additional Comments: 
//
//////////////////////////////////////////////////////////////////////////////////
module counter(
   input clock,
	input [1:0] reset,
	input enable,
	output reg [3:0] counters
	);
	
	reg [28:0] clock_divider;

	initial begin
		clock_divider <= 0;
		counters <= 4'b0000;
	end
	
	always @(posedge clock) begin
        // Prioridade 1: Reset (Qualquer combinação que não seja 00)
        if (reset != 2'b00) begin
            counters <= 4'b0000;
            clock_divider <= 0;
        end
		  
		  else if (~enable) begin
            counters <= 4'b0000;
            clock_divider <= 0;
        end
		  
		  else begin
            clock_divider <= clock_divider + 1;
            if (clock_divider >= 250000000) begin 
                clock_divider <= 0;
                if (counters < 4'b1001) begin
                    counters <= counters + 1;
                end else begin
                    counters <= 4'b1001; // Trava no 9 (ou volta a 0 se preferires)
                end
            end
        end
    end
endmodule