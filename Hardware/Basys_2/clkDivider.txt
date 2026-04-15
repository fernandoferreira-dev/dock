`timescale 1ns / 1ps
//////////////////////////////////////////////////////////////////////////////////
// Company: 
// Engineer: 
// 
// Create Date:    09:01:36 04/08/2026 
// Design Name: 
// Module Name:    clkDivider 
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
module clkDivider(
    input clk_50MHz,
    input [1:0] reset,
    output reg clk_5sec
	 );

	parameter DIVIDER = 28'd250000000;
	reg [27:0] counter = 28'd0;
	 
	initial begin
		clk_5sec = 0;
	end
	
	always @(posedge clk_50MHz) begin
		counter <= counter + 28'd1;
		if (counter >= (DIVIDER - 1)) begin
			counter <= 0;
		end 
		clk_5sec <= (counter<DIVIDER/2)?1'b1:1'b0;
	end

endmodule
